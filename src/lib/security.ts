import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
} from 'node:crypto';
import { getDb } from './db';
import { site } from './config';

export const opaqueToken = () => randomBytes(32).toString('base64url');
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
function secret() {
  const value = process.env.AUTH_SECRET || '';
  if (value.length < 32) throw new Error('AUTH_SECRET_NOT_CONFIGURED');
  return value;
}
export function equal(a: string, b: string) {
  return timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
}
export function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(digest(secret()), 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}
export function unseal(value: string) {
  const bytes = Buffer.from(value, 'base64url');
  const cipher = createDecipheriv(
    'aes-256-gcm',
    Buffer.from(digest(secret()), 'hex'),
    bytes.subarray(0, 12),
  );
  cipher.setAuthTag(bytes.subarray(12, 28));
  return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString('utf8');
}
export function adminTicket() {
  const expires = String(Date.now() + 3600000);
  return `${expires}.${createHmac('sha256', secret()).update(`admin:${expires}`).digest('hex')}`;
}
export function validAdmin(ticket: string) {
  const [expires, signature] = ticket.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return equal(signature, createHmac('sha256', secret()).update(`admin:${expires}`).digest('hex'));
}
export function cookie(request: Request, name: string) {
  return (
    request.headers
      .get('cookie')
      ?.split(';')
      .map((v) => v.trim())
      .find((v) => v.startsWith(`${name}=`))
      ?.slice(name.length + 1) || ''
  );
}
export function sessionCookie(name: string, value: string, maxAge: number) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(site.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export async function member(request: Request) {
  const token = cookie(request, 'vyve-session');
  if (!token) return null;
  const session = await getDb().memberSession.findUnique({
    where: { hash: digest(token) },
    include: { entry: true },
  });
  return session && session.expiresAt > new Date() && session.entry.verifiedAt
    ? session.entry
    : null;
}
export async function rateLimit(request: Request, scope: string, max = 10) {
  const keySecret = process.env.RATE_LIMIT_SECRET || '';
  if (keySecret.length < 32) throw new Error('RATE_LIMIT_NOT_CONFIGURED');
  const trusted = process.env.TRUST_PROXY === 'true';
  const identity = trusted
    ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    : 'shared';
  const window = Math.floor(Date.now() / 600000);
  const key = createHmac('sha256', keySecret)
    .update(`${scope}:${identity}:${window}`)
    .digest('hex');
  const bucket = await getDb().rateLimitBucket.upsert({
    where: { key },
    create: { key, expiresAt: new Date((window + 2) * 600000) },
    update: { count: { increment: 1 } },
  });
  return bucket.count <= (trusted ? max : max * 10);
}
export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', ...headers },
  });
}
export async function input(request: Request) {
  const origin = request.headers.get('origin');
  if (
    origin &&
    origin !== new URL(request.url).origin &&
    origin !== new URL(site.url).origin
  )
    throw new Error('ORIGIN');
  if (!request.headers.get('content-type')?.includes('application/json')) throw new Error('JSON');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('BODY');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 4096) {
      await reader.cancel();
      throw new Error('SIZE');
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}
