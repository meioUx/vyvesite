import { beforeEach, describe, expect, it, vi } from 'vitest';
const { tx } = vi.hoisted(() => ({
  tx: {
    $queryRaw: vi.fn(),
    waitlistEntry: { findUniqueOrThrow: vi.fn(), updateMany: vi.fn() },
    analyticsEvent: { create: vi.fn() },
    memberSession: { create: vi.fn() },
  },
}));
vi.mock('../src/lib/db', () => ({
  getDb: () => ({ $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) }),
}));
vi.mock('../src/lib/security', async (original) => ({
  ...(await original<typeof import('../src/lib/security')>()),
  rateLimit: vi.fn().mockResolvedValue(true),
}));
import { POST } from '../src/app/api/waitlist/verify/route';
const token = 'a'.repeat(43);
const request = (value = token) =>
  new Request('http://localhost:3000/api/waitlist/verify', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: value }),
  });
beforeEach(() => {
  vi.clearAllMocks();
  tx.$queryRaw.mockResolvedValue([{ entryId: 'member' }]);
  tx.waitlistEntry.findUniqueOrThrow.mockResolvedValue({ id: 'member', referredById: 'referrer' });
  tx.waitlistEntry.updateMany.mockResolvedValue({ count: 1 });
});
describe('verification boundary', () => {
  it('creates a private hashed session and operational events on first confirmation', async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('HttpOnly; SameSite=Strict');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(tx.memberSession.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entryId: 'member',
        hash: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    });
    expect(tx.analyticsEvent.create.mock.calls.map(([args]) => args.data)).toEqual([
      { name: 'waitlist_email_verified' },
      { name: 'referral_signup_verified' },
    ]);
  });
  it('rejects expired, unknown or already consumed tokens without issuing sessions', async () => {
    tx.$queryRaw.mockResolvedValue([]);
    expect((await POST(request())).status).toBe(400);
    expect(tx.memberSession.create).not.toHaveBeenCalled();
    expect(tx.analyticsEvent.create).not.toHaveBeenCalled();
  });
  it('does not double-count verified users requesting a new access link', async () => {
    tx.waitlistEntry.updateMany.mockResolvedValue({ count: 0 });
    expect((await POST(request())).status).toBe(200);
    expect(tx.analyticsEvent.create).not.toHaveBeenCalled();
  });
  it('rejects malformed credentials before accessing the transaction', async () => {
    expect((await POST(request('not-a-token'))).status).toBe(400);
    expect(tx.$queryRaw).not.toHaveBeenCalled();
  });
});
