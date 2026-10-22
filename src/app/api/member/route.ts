import { z } from 'zod';
import { getDb } from '@/lib/db';
import { member, input, json, rateLimit, sessionCookie, cookie, digest } from '@/lib/security';
import { challengeDay } from '@/lib/challenge';
import { site } from '@/lib/config';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const entry = await member(request);
    if (!entry)
      return json({ message: 'Confirme seu e-mail ou solicite um novo link de acesso.' }, 401);
    const [verifiedInvites, pendingInvites, settings, days] = await Promise.all([
      getDb().waitlistEntry.count({ where: { referredById: entry.id, verifiedAt: { not: null } } }),
      getDb().waitlistEntry.count({ where: { referredById: entry.id, verifiedAt: null } }),
      getDb().launchSettings.findUnique({ where: { id: 'launch' } }),
      getDb().challengeDay.findMany({
        where: { entryId: entry.id },
        select: { day: true },
        orderBy: { day: 'asc' },
      }),
    ]);
    return json({
      referralCode: entry.referralCode,
      referralUrl: `${site.url}/?ref=${entry.referralCode}&utm_source=referral&utm_medium=share`,
      verifiedInvites,
      pendingInvites,
      marketingConsent: entry.marketingConsent,
      migrationConsent: !!entry.migrationConsentAt,
      betaInvited: !!entry.betaInvitedAt,
      rewards:
        settings?.rewardsEnabled && settings.approvedAt
          ? { rules: settings.rewardRules, threshold: settings.rewardThreshold }
          : null,
      challengeStartedAt: entry.challengeStartedAt,
      days: days.map((d) => d.day),
    });
  } catch {
    return json({ message: 'Painel indisponível. Tente novamente.' }, 503);
  }
}
export async function POST(request: Request) {
  try {
    if (!(await rateLimit(request, 'member', 30)))
      return json({ message: 'Muitas tentativas.' }, 429);
    const body = z
      .discriminatedUnion('action', [
        z.object({
          action: z.literal('preferences'),
          marketingConsent: z.boolean(),
          migrationConsent: z.boolean(),
        }),
        z.object({ action: z.literal('delete'), confirmation: z.literal('EXCLUIR') }),
        z.object({ action: z.literal('logout') }),
        z.object({ action: z.literal('challenge_start') }),
        z.object({ action: z.literal('challenge_day') }),
      ])
      .parse(await input(request));
    const entry = await member(request);
    if (!entry) return json({ message: 'Acesso expirado.' }, 401);
    const db = getDb();
    if (body.action === 'delete') {
      await db.waitlistEntry.delete({ where: { id: entry.id } });
      return json({ message: 'Dados excluídos da base ativa.' }, 200, {
        'Set-Cookie': sessionCookie('vyve-session', '', 0),
      });
    }
    if (body.action === 'logout') {
      await db.memberSession.deleteMany({
        where: { hash: digest(cookie(request, 'vyve-session')) },
      });
      return json({ message: 'Sessão encerrada.' }, 200, {
        'Set-Cookie': sessionCookie('vyve-session', '', 0),
      });
    }
    if (body.action === 'preferences') {
      await db.$transaction(async (tx) => {
        await tx.waitlistEntry.update({
          where: { id: entry.id },
          data: {
            marketingConsent: body.marketingConsent,
            marketingConsentAt: body.marketingConsent
              ? entry.marketingConsentAt || new Date()
              : null,
            migrationConsentAt: body.migrationConsent
              ? entry.migrationConsentAt || new Date()
              : null,
          },
        });
        if (!body.marketingConsent)
          await tx.mailMessage.deleteMany({
            where: { entryId: entry.id, kind: 'marketing', sentAt: null },
          });
      });
    }
    if (body.action === 'challenge_start')
      await db.waitlistEntry.updateMany({
        where: { id: entry.id, challengeStartedAt: null },
        data: { challengeStartedAt: new Date() },
      });
    if (body.action === 'challenge_day') {
      if (!entry.challengeStartedAt) return json({ message: 'Inicie o desafio primeiro.' }, 400);
      const day = challengeDay(entry.challengeStartedAt, new Date());
      if (day > 30) return json({ message: 'Os 30 dias terminaram.' }, 400);
      await db.challengeDay.upsert({
        where: { entryId_day: { entryId: entry.id, day } },
        create: { entryId: entry.id, day },
        update: {},
      });
    }
    return json({ message: 'Atualizado.' });
  } catch {
    return json({ message: 'Não foi possível concluir a solicitação.' }, 400);
  }
}
