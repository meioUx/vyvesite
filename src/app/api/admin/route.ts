import { z } from 'zod';
import { getDb } from '@/lib/db';
import { report } from '@/features/analytics/report';
import {
  input,
  json,
  rateLimit,
  cookie,
  equal,
  adminTicket,
  validAdmin,
  sessionCookie,
  seal,
} from '@/lib/security';
import { site } from '@/lib/config';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    if (!validAdmin(cookie(request, 'vyve-admin')))
      return json({ message: 'Entre para acessar o painel.' }, 401);
    return json({
      ...(await report()),
      settings: await getDb().launchSettings.findUnique({ where: { id: 'launch' } }),
    });
  } catch {
    return json({ message: 'Painel indisponível.' }, 503);
  }
}
export async function POST(request: Request) {
  try {
    if (!(await rateLimit(request, 'admin', 5)))
      return json({ message: 'Muitas tentativas.' }, 429);
    const body = z
      .discriminatedUnion('action', [
        z.object({ action: z.literal('login'), password: z.string().max(200) }),
        z.object({ action: z.literal('logout') }),
        z.object({
          action: z.literal('rewards'),
          enabled: z.boolean(),
          rules: z.string().trim().max(2000),
          threshold: z.number().int().min(1).max(1000),
          approved: z.literal(true),
        }),
        z.object({
          action: z.literal('beta'),
          limit: z.number().int().min(1).max(50),
          authorized: z.literal(true),
        }),
        z.object({ action: z.literal('export'), authorized: z.literal(true) }),
        z.object({
          action: z.literal('campaign'),
          subject: z.string().trim().min(1).max(120),
          text: z.string().trim().min(1).max(2000),
          authorized: z.literal(true),
        }),
      ])
      .parse(await input(request));
    if (body.action === 'login') {
      const password = process.env.ADMIN_PASSWORD || '';
      if (password.length < 32)
        return json(
          {
            message: 'Configure ADMIN_PASSWORD (32 caracteres ou mais) e AUTH_SECRET no servidor.',
          },
          503,
        );
      if (!equal(body.password, password)) return json({ message: 'Credencial inválida.' }, 401);
      return json({}, 200, { 'Set-Cookie': sessionCookie('vyve-admin', adminTicket(), 3600) });
    }
    if (!validAdmin(cookie(request, 'vyve-admin'))) return json({ message: 'Acesso negado.' }, 401);
    if (body.action === 'logout')
      return json({}, 200, { 'Set-Cookie': sessionCookie('vyve-admin', '', 0) });
    const db = getDb();
    if (body.action === 'rewards') {
      if (body.enabled && body.rules.length < 30)
        return json({ message: 'Descreva as regras aprovadas (mínimo de 30 caracteres).' }, 400);
      await db.$transaction([
        db.launchSettings.upsert({
          where: { id: 'launch' },
          create: {
            rewardsEnabled: body.enabled,
            rewardRules: body.rules,
            rewardThreshold: body.threshold,
            approvedAt: new Date(),
          },
          update: {
            rewardsEnabled: body.enabled,
            rewardRules: body.rules,
            rewardThreshold: body.threshold,
            approvedAt: new Date(),
          },
        }),
        db.adminAudit.create({ data: { action: 'rewards_approved', count: 1 } }),
      ]);
      return json({ message: 'Regras salvas.' });
    }
    if (body.action === 'export') {
      const entries = await db.waitlistEntry.findMany({
        where: { verifiedAt: { not: null }, migrationConsentAt: { not: null } },
        select: {
          id: true,
          email: true,
          name: true,
          consentVersion: true,
          verifiedAt: true,
          migrationConsentAt: true,
          source: true,
          campaign: true,
          medium: true,
        },
        take: 10000,
      });
      await db.adminAudit.create({ data: { action: 'authorized_export', count: entries.length } });
      return json({ version: 1, purpose: 'authorized_vyve_import', entries }, 200, {
        'Content-Disposition': 'attachment; filename="vyve-authorized-import.json"',
      });
    }
    const count = await db.$transaction(async (tx) => {
      // Serializes campaign/beta selection to prevent concurrent duplicate batches.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(861902)`;
      const entries = await tx.waitlistEntry.findMany({
        where: {
          verifiedAt: { not: null },
          ...(body.action === 'beta' ? { betaInvitedAt: null } : { marketingConsent: true }),
        },
        orderBy: { createdAt: 'asc' },
        take: body.action === 'beta' ? body.limit : 50,
      });
      for (const entry of entries) {
        if (body.action === 'beta')
          await tx.waitlistEntry.update({
            where: { id: entry.id },
            data: { betaInvitedAt: new Date() },
          });
        await tx.mailMessage.create({
          data: {
            entryId: entry.id,
            kind: body.action === 'beta' ? 'beta' : 'marketing',
            payload: seal(
              JSON.stringify(
                body.action === 'beta'
                  ? {
                      subject: 'VYVE — convite para o beta',
                      text: `Você foi selecionado para uma próxima etapa do beta VYVE. Esta seleção não libera acesso ao aplicativo. Acompanhe o status no painel: ${site.url}/painel`,
                    }
                  : {
                      subject: body.subject,
                      text: `${body.text}\n\nGerencie ou cancele comunicações no painel: ${site.url}/painel`,
                    },
              ),
            ),
          },
        });
      }
      await tx.adminAudit.create({ data: { action: body.action, count: entries.length } });
      return entries.length;
    });
    return json({ message: `${count} mensagens preparadas na fila.`, count });
  } catch {
    return json({ message: 'Solicitação inválida ou serviço indisponível.' }, 400);
  }
}
