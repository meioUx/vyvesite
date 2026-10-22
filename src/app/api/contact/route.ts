import { createHmac } from 'node:crypto';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { site } from '@/lib/config';

export const runtime = 'nodejs';
const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
});
export async function POST(request: Request) {
  const json = (status: number) =>
    Response.json({ ok: status === 200 }, { status, headers: { 'Cache-Control': 'no-store' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin && origin !== new URL(site.url).origin)
    return json(403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json(415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return json(400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 24000) {
        await reader.cancel();
        return json(413);
      }
      chunks.push(value);
    }
    let body: unknown;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return json(400);
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return json(400);
    if (parsed.data.website) return json(200);
    const secret = process.env.RATE_LIMIT_SECRET || '';
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.MAIL_FROM ||
      !site.contact ||
      secret.length < 32
    )
      return json(503);
    const trusted = process.env.TRUST_PROXY === 'true';
    const identity = trusted
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'shared';
    const window = Math.floor(Date.now() / 600000);
    const key = createHmac('sha256', secret).update(`contact:${identity}:${window}`).digest('hex');
    const db = getDb();
    await db.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    const bucket = await db.rateLimitBucket.upsert({
      where: { key },
      create: { key, expiresAt: new Date((window + 2) * 600000) },
      update: { count: { increment: 1 } },
    });
    if (bucket.count > (trusted ? 5 : 50)) return json(429);
    const { name, email, message } = parsed.data;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [site.contact],
        reply_to: email,
        subject: 'Contato pelo site VYVE',
        text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
      }),
    });
    return json(response.ok ? 200 : 503);
  } catch {
    return json(503);
  }
}
