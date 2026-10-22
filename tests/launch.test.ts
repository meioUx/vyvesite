import { afterEach, describe, expect, it, vi } from 'vitest';
import { challengeDay } from '../src/lib/challenge';
import { emailIdentity } from '../src/features/waitlist/identity';
import { sourceBucket } from '../src/features/analytics/events';
import {
  digest,
  seal,
  unseal,
  opaqueToken,
  adminTicket,
  validAdmin,
  input,
} from '../src/lib/security';
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
describe('launch security', () => {
  it('encrypts email payloads and detects tampering', () => {
    vi.stubEnv('AUTH_SECRET', 'x'.repeat(32));
    const payload = seal('https://example.com/confirmar#token=private');
    expect(payload).not.toContain('private');
    expect(unseal(payload)).toBe('https://example.com/confirmar#token=private');
    const corrupted = Buffer.from(payload, 'base64url');
    corrupted[30] ^= 1;
    expect(() => unseal(corrupted.toString('base64url'))).toThrow();
  });
  it('requires a configured auth secret', () => {
    vi.stubEnv('AUTH_SECRET', '');
    expect(() => seal('secret')).toThrow('AUTH_SECRET_NOT_CONFIGURED');
  });
  it('issues expiring, signed administrative sessions', () => {
    vi.stubEnv('AUTH_SECRET', 'x'.repeat(32));
    vi.useFakeTimers();
    const ticket = adminTicket();
    expect(validAdmin(ticket)).toBe(true);
    expect(validAdmin(`${Date.now() + 100000}.forged`)).toBe(false);
    vi.advanceTimersByTime(3600001);
    expect(validAdmin(ticket)).toBe(false);
  });
  it('generates high entropy credentials stored only as hashes', () => {
    const token = opaqueToken();
    expect(token).toMatch(/^[\w-]{43}$/);
    expect(digest(token)).toHaveLength(64);
    expect(opaqueToken()).not.toBe(token);
  });
  it('rejects cross-origin mutations and oversized streamed JSON', async () => {
    const request = (body: string, origin: string) =>
      new Request('http://localhost:3000/api/member', {
        method: 'POST',
        headers: { origin, 'Content-Type': 'application/json' },
        body,
      });
    await expect(input(request('{}', 'https://attacker.invalid'))).rejects.toThrow('ORIGIN');
    await expect(
      input(request(JSON.stringify({ value: 'a'.repeat(5000) }), 'http://localhost:3000')),
    ).rejects.toThrow('SIZE');
  });
});
describe('referral and analytics boundaries', () => {
  it.each(['a.l.i.c.e+invite@gmail.com', 'alice@googlemail.com', 'ALICE@gmail.com'])(
    'blocks common mailbox aliases as separate referrals: %s',
    (email) => {
      expect(emailIdentity(email)).toBe('alice@gmail.com');
    },
  );
  it('preserves dots on non-Gmail domains and deduplicates plus aliases conservatively', () => {
    expect(emailIdentity('a.b+tag@example.com')).toBe('a.b@example.com');
  });
  it('does not allow arbitrary attribution or PII as an analytics source', () => {
    expect(sourceBucket('alice@example.com')).toBe('other');
    expect(sourceBucket('instagram')).toBe('instagram');
    expect(sourceBucket(null)).toBe('direct');
  });
});
describe('30 day personal challenge', () => {
  it('uses UTC calendar days rather than 24-hour intervals', () => {
    expect(challengeDay(new Date('2026-10-01T23:59:00Z'), new Date('2026-10-02T00:00:00Z'))).toBe(
      2,
    );
    expect(challengeDay(new Date('2026-10-01T23:59:00Z'), new Date('2026-10-30T23:59:00Z'))).toBe(
      30,
    );
    expect(challengeDay(new Date('2026-10-01T23:59:00Z'), new Date('2026-10-31T00:00:00Z'))).toBe(
      31,
    );
  });
});
