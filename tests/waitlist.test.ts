import { describe, it, expect, vi } from 'vitest';
import { waitlistSchema } from '../src/features/waitlist/schema';
import { subscribe, type WaitlistStore } from '../src/features/waitlist/service';
const data = { email: '  PERSON@EXAMPLE.COM ', consent: true, name: ' Ana ' };
function request(body: unknown, headers = {}) {
  return new Request('http://localhost:3000/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}
function store(): WaitlistStore {
  return { limit: vi.fn().mockResolvedValue(1), save: vi.fn().mockResolvedValue(undefined) };
}
const options = { secret: 'a'.repeat(32), trustProxy: true };
describe('validation', () => {
  it('normalizes email and trims name', () => {
    expect(waitlistSchema.parse(data)).toMatchObject({ email: 'person@example.com', name: 'Ana' });
  });
  it.each([
    { ...data, email: 'bad' },
    { ...data, consent: false },
    { ...data, name: 'x'.repeat(81) },
    { ...data, source: 'x'.repeat(121) },
  ])('rejects invalid input', (input) => {
    expect(waitlistSchema.safeParse(input).success).toBe(false);
  });
});
describe('waitlist API service', () => {
  it('persists normalized data and consent version', async () => {
    const db = store();
    const res = await subscribe(request(data), db, options);
    expect(res.status).toBe(200);
    expect(db.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'person@example.com',
        consent: true,
        consentVersion: '2026-10-18-v1',
      }),
    );
  });
  it('rejects missing consent without storage', async () => {
    const db = store();
    expect((await subscribe(request({ email: 'a@b.com' }), db, options)).status).toBe(400);
    expect(db.save).not.toHaveBeenCalled();
  });
  it('silently discards honeypot submissions', async () => {
    const db = store();
    expect((await subscribe(request({ ...data, website: 'bot' }), db, options)).status).toBe(200);
    expect(db.save).not.toHaveBeenCalled();
  });
  it('returns generic success for duplicates through idempotent storage', async () => {
    const db = store();
    const a = await subscribe(request(data), db, options);
    const b = await subscribe(request(data), db, options);
    expect(await a.json()).toEqual(await b.json());
  });
  it('rate limits without exposing email or saving', async () => {
    const db = store();
    vi.mocked(db.limit).mockResolvedValue(6);
    const res = await subscribe(request(data), db, options);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('600');
    expect(db.save).not.toHaveBeenCalled();
  });
  it('rejects untrusted origins', async () => {
    const db = store();
    expect(
      (await subscribe(request(data, { origin: 'https://untrusted.example' }), db, options)).status,
    ).toBe(403);
    expect(db.save).not.toHaveBeenCalled();
  });
  it('rejects oversized payloads', async () => {
    expect((await subscribe(request({ email: 'x'.repeat(5000) }), store(), options)).status).toBe(
      413,
    );
  });
  it('rejects malformed JSON', async () => {
    const req = new Request('http://localhost:3000/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    });
    expect((await subscribe(req, store(), options)).status).toBe(400);
  });
  it('returns 503 rather than simulated success when database fails', async () => {
    const db = store();
    vi.mocked(db.save).mockRejectedValue(new Error('unavailable'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await subscribe(request(data), db, options)).status).toBe(503);
    expect(spy).toHaveBeenCalledWith('[waitlist] persistence_unavailable');
    spy.mockRestore();
  });
});
