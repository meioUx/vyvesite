import { beforeEach, expect, it, vi } from 'vitest';
const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('../src/lib/db', () => ({ getDb: () => ({ analyticsEvent: { create } }) }));
vi.mock('../src/lib/security', async (original) => ({
  ...(await original<typeof import('../src/lib/security')>()),
  rateLimit: vi.fn().mockResolvedValue(true),
}));
import { POST } from '../src/app/api/events/route';
const body = {
  name: 'share',
  source: 'referral',
  tool: 'referral',
  consent: true,
  visitor: '11111111-1111-4111-8111-111111111111',
};
function request(data: object) {
  return new Request('http://localhost:3000/api/events', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
beforeEach(() => vi.clearAllMocks());
it('rejects extra fields containing personal information', async () => {
  expect((await POST(request({ ...body, email: 'person@example.com' }))).status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});
it('rejects arbitrary tool/source parameters and events without consent', async () => {
  for (const extra of [
    { tool: 'person@example.com' },
    { source: 'person@example.com' },
    { consent: false },
  ])
    expect((await POST(request({ ...body, ...extra }))).status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});
it('does not permit browser clients to forge verified signup counters', async () => {
  for (const name of ['waitlist_email_verified', 'referral_signup_verified'])
    expect((await POST(request({ ...body, name }))).status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});
it('stores only enumerated parameters and a hash of the random browser identifier', async () => {
  expect((await POST(request(body))).status).toBe(200);
  expect(create).toHaveBeenCalledWith({
    data: {
      name: 'share',
      tool: 'referral',
      source: 'referral',
      visitor: expect.stringMatching(/^[a-f0-9]{64}$/),
    },
  });
});
