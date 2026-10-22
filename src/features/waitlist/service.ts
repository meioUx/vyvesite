import { createHmac } from 'node:crypto';
import { waitlistSchema } from './schema';
import { site } from '@/lib/config';
export interface WaitlistStore {
  limit(key: string, expiresAt: Date): Promise<number>;
  save(data: {
    name: string | null;
    email: string;
    consent: boolean;
    consentVersion: string;
    source: string | null;
    campaign: string | null;
    medium: string | null;
    marketingConsent: boolean;
    referralCode?: string;
  }): Promise<void>;
}
const accepted = {
  message:
    'Solicitação recebida. Se o endereço puder participar, enviaremos um link de confirmação e acesso, válido por 24 horas. A inscrição só é concluída após confirmar o e-mail.',
};
export async function subscribe(
  request: Request,
  store: WaitlistStore,
  options: { secret: string; trustProxy: boolean },
) {
  const json = (body: object, status = 200, headers: Record<string, string> = {}) =>
    Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
  const origin = request.headers.get('origin');
  if (origin) {
    let sameHost = false;
    try {
      const incoming = new URL(origin);
      sameHost =
        incoming.host === request.headers.get('host') &&
        incoming.protocol === new URL(request.url).protocol;
    } catch {
      /* Invalid origins are rejected. */
    }
    if (!sameHost && origin !== new URL(request.url).origin && origin !== new URL(site.url).origin)
      return json({ message: 'Origem não autorizada.' }, 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json'))
    return json({ message: 'Envie um formulário JSON válido.' }, 415);
  if (Number(request.headers.get('content-length') || 0) > 4096)
    return json({ message: 'Formulário muito grande.' }, 413);
  try {
    // Read through a bounded stream; do not trust Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ message: 'Formulário vazio.' }, 400);
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 4096) {
        await reader.cancel();
        return json({ message: 'Formulário muito grande.' }, 413);
      }
      chunks.push(value);
    }
    let body: unknown;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return json({ message: 'Formulário inválido.' }, 400);
    }
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) return json({ message: 'Revise o e-mail e o consentimento.' }, 400);
    if (parsed.data.website) return json(accepted);
    if (options.secret.length < 32) throw new Error('RATE_LIMIT_NOT_CONFIGURED');
    const identity = options.trustProxy
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'shared';
    const window = Math.floor(Date.now() / 600000);
    const key = createHmac('sha256', options.secret).update(`${identity}:${window}`).digest('hex');
    const count = await store.limit(key, new Date((window + 2) * 600000));
    if (count > (options.trustProxy ? 5 : 50))
      return json(
        { message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
        429,
        { 'Retry-After': '600' },
      );
    const { name, email, consent, source, campaign, medium, marketingConsent, referralCode } =
      parsed.data;
    await store.save({
      name: name || null,
      email,
      consent,
      consentVersion: site.consentVersion,
      source: source || null,
      campaign: campaign || null,
      medium: medium || null,
      marketingConsent,
      referralCode,
    });
    return json(accepted);
  } catch {
    console.error('[waitlist] persistence_unavailable');
    return json({ message: 'Não foi possível salvar agora. Tente novamente em instantes.' }, 503);
  }
}
