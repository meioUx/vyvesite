import { z } from 'zod';
import { getDb } from '@/lib/db';
import { input, json, rateLimit, digest, opaqueToken, sessionCookie } from '@/lib/security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    if (!(await rateLimit(request, 'verify')))
      return json({ message: 'Aguarde antes de tentar novamente.' }, 429);
    const { token } = z
      .object({ token: z.string().regex(/^[\w-]{43}$/) })
      .parse(await input(request));
    const rawSession = opaqueToken();
    const outcome = await getDb().$transaction(async (tx) => {
      // DELETE RETURNING makes consumption atomic across concurrent requests.
      const rows = await tx.$queryRaw<
        { entryId: string }[]
      >`DELETE FROM "AccessToken" WHERE "hash" = ${digest(token)} AND "expiresAt" > NOW() RETURNING "entryId"`;
      if (!rows.length) return null;
      const entry = await tx.waitlistEntry.findUniqueOrThrow({ where: { id: rows[0].entryId } });
      const changed = await tx.waitlistEntry.updateMany({
        where: { id: entry.id, verifiedAt: null },
        data: { verifiedAt: new Date() },
      });
      // Operational counters contain no identity, referral code, email, campaign, or name.
      if (changed.count) {
        await tx.analyticsEvent.create({ data: { name: 'waitlist_email_verified' } });
        if (entry.referredById)
          await tx.analyticsEvent.create({ data: { name: 'referral_signup_verified' } });
      }
      await tx.memberSession.create({
        data: {
          hash: digest(rawSession),
          entryId: entry.id,
          expiresAt: new Date(Date.now() + 7 * 86400000),
        },
      });
      return { newlyVerified: !!changed.count, referred: !!entry.referredById };
    });
    if (!outcome)
      return json(
        { message: 'Link inválido, utilizado ou expirado. Solicite outro pela lista de espera.' },
        400,
      );
    return json(outcome, 200, {
      'Set-Cookie': sessionCookie('vyve-session', rawSession, 7 * 86400),
    });
  } catch {
    return json(
      { message: 'Não foi possível confirmar. Verifique o link ou tente mais tarde.' },
      400,
    );
  }
}
