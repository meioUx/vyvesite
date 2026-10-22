import { afterEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/config', () => ({ site: { url: 'http://localhost:3000', contact: 'contato@vyve.world' } }));

vi.mock('@/lib/db', () => ({ getDb: () => ({ rateLimitBucket: { deleteMany: vi.fn(), upsert: vi.fn().mockResolvedValue({ count: 1 }) } }) }));
import { POST } from '@/app/api/contact/route';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const request = (data: object) => new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const message = { name: 'Maria', email: 'maria@example.com', message: 'Preciso de ajuda com o aplicativo.' };

it('rejects invalid data without sending mail', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  expect((await POST(request({ ...message, email: 'invalid' }))).status).toBe(400);
  expect(fetcher).not.toHaveBeenCalled();
});
it('sends to the configured support address with the visitor as reply-to', async () => {
  vi.stubEnv('RESEND_API_KEY', 'test'); vi.stubEnv('MAIL_FROM', 'VYVE <sender@example.com>'); vi.stubEnv('RATE_LIMIT_SECRET', 'a'.repeat(32));
  const fetcher = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal('fetch', fetcher);
  expect((await POST(request(message))).status).toBe(200);
  const payload = JSON.parse(fetcher.mock.calls[0][1].body);
  expect(payload.reply_to).toBe(message.email);
  expect(payload.to).toEqual(['contato@vyve.world']);
});
it('reports provider failure instead of claiming success', async () => {
  vi.stubEnv('RESEND_API_KEY', 'test'); vi.stubEnv('MAIL_FROM', 'sender@example.com'); vi.stubEnv('RATE_LIMIT_SECRET', 'a'.repeat(32));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  expect((await POST(request(message))).status).toBe(503);
});
