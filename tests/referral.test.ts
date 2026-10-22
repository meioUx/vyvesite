import { beforeEach, describe, expect, it, vi } from 'vitest';
const { tx } = vi.hoisted(() => ({
  tx: {
    $executeRaw: vi.fn(),
    waitlistEntry: { findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
    mailMessage: { count: vi.fn(), create: vi.fn() },
    accessToken: { create: vi.fn() },
  },
}));
vi.mock('../src/lib/db', () => ({
  getDb: () => ({ $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) }),
}));
import { saveSubscription } from '../src/features/waitlist/persistence';
const data = {
  name: null,
  email: 'person@example.com',
  consent: true,
  marketingConsent: false,
  consentVersion: 'test',
  source: 'instagram',
  medium: null,
  campaign: null,
  referralCode: 'ref-code',
};
beforeEach(() => {
  vi.resetAllMocks();
  process.env.AUTH_SECRET = 'x'.repeat(32);
  tx.waitlistEntry.create.mockResolvedValue({ id: 'new-entry' });
  tx.waitlistEntry.findFirst.mockResolvedValue(null);
  tx.mailMessage.count.mockResolvedValue(0);
});
describe('referral persistence', () => {
  it('attributes only a verified referrer and queues an encrypted confirmation atomically', async () => {
    tx.waitlistEntry.findUnique.mockResolvedValue({
      id: 'referrer',
      email: 'other@example.com',
      verifiedAt: new Date(),
    });
    await saveSubscription(data);
    expect(tx.waitlistEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        referredById: 'referrer',
        emailIdentity: data.email,
        marketingConsentAt: null,
      }),
    });
    expect(tx.accessToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        hash: expect.stringMatching(/^[a-f0-9]{64}$/),
        entryId: 'new-entry',
      }),
    });
    expect(tx.mailMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: 'access',
        payload: expect.not.stringContaining('token='),
      }),
    });
  });
  it.each([
    null,
    { id: 'pending', email: 'other@example.com', verifiedAt: null },
    { id: 'self', email: data.email, verifiedAt: new Date() },
  ])('ignores invalid, pending and self-referrals', async (referrer) => {
    tx.waitlistEntry.findUnique.mockResolvedValue(referrer);
    await saveSubscription(data);
    expect(tx.waitlistEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ referredById: null }),
    });
  });
  it('does not overwrite the first attribution, name or consent on duplicate or alias signup', async () => {
    tx.waitlistEntry.findFirst.mockResolvedValue({ id: 'original' });
    await saveSubscription(data);
    expect(tx.waitlistEntry.create).not.toHaveBeenCalled();
    expect(tx.accessToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ entryId: 'original' }),
    });
  });
  it('prevents repeated requests from queuing multiple access messages within an hour', async () => {
    tx.waitlistEntry.findFirst.mockResolvedValue({ id: 'original' });
    tx.mailMessage.count.mockResolvedValue(1);
    await saveSubscription(data);
    expect(tx.accessToken.create).not.toHaveBeenCalled();
    expect(tx.mailMessage.create).not.toHaveBeenCalled();
  });
});
