import { getDb } from '@/lib/db';
import { digest, opaqueToken, seal } from '@/lib/security';
import { site } from '@/lib/config';
import type { WaitlistStore } from './service';
import { emailIdentity } from './identity';

export async function saveSubscription(data: Parameters<WaitlistStore['save']>[0]) {
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM)
  )
    throw new Error('MAIL_NOT_CONFIGURED');
  await getDb().$transaction(async (tx) => {
    const identity = emailIdentity(data.email);
    // Serialize per mailbox, including concurrent alias submissions.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${identity}, 0))`;
    const existing = await tx.waitlistEntry.findFirst({
      where: { OR: [{ email: data.email }, { emailIdentity: identity }] },
    });
    // Repeated requests can request access, but cannot overwrite consent or attribution.
    if (existing) {
      const recent = await tx.mailMessage.count({
        where: {
          entryId: existing.id,
          kind: 'access',
          createdAt: { gt: new Date(Date.now() - 3600000) },
        },
      });
      if (recent) return;
    }
    const referrer = data.referralCode
      ? await tx.waitlistEntry.findUnique({ where: { referralCode: data.referralCode } })
      : null;
    const { referralCode: _code, ...fields } = data;
    void _code;
    const entry =
      existing ||
      (await tx.waitlistEntry.create({
        data: {
          ...fields,
          emailIdentity: identity,
          marketingConsentAt: data.marketingConsent ? new Date() : null,
          referredById: referrer?.verifiedAt && referrer.email !== data.email ? referrer.id : null,
        },
      }));
    const token = opaqueToken();
    await tx.accessToken.create({
      data: { hash: digest(token), entryId: entry.id, expiresAt: new Date(Date.now() + 86400000) },
    });
    await tx.mailMessage.create({
      data: {
        entryId: entry.id,
        kind: 'access',
        payload: seal(JSON.stringify({ url: `${site.url}/confirmar#token=${token}` })),
      },
    });
  });
}
