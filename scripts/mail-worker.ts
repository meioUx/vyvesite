import 'dotenv/config';
import { getDb } from '../src/lib/db';
import { unseal } from '../src/lib/security';

// Explicit operator command only. Never invoked during build, signup, or tests.
const db = getDb();
try {
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM)
    throw new Error('Configure RESEND_API_KEY e MAIL_FROM antes de enviar.');
  for (let i = 0; i < 50; i++) {
    const claimed = await db.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<
        { id: string }[]
      >`SELECT id FROM "MailMessage" WHERE "sentAt" IS NULL AND attempts < 5 AND ("lockedUntil" IS NULL OR "lockedUntil" < NOW()) AND "createdAt" > NOW() - INTERVAL '23 hours' ORDER BY "createdAt" FOR UPDATE SKIP LOCKED LIMIT 1`;
      if (!rows.length) return null;
      return tx.mailMessage.update({
        where: { id: rows[0].id },
        data: { attempts: { increment: 1 }, lockedUntil: new Date(Date.now() + 600000) },
        include: { entry: true },
      });
    });
    if (!claimed) break;
    // Re-check optional consent immediately before dispatch.
    const entry = await db.waitlistEntry.findUnique({ where: { id: claimed.entryId } });
    if (
      !entry ||
      (claimed.kind === 'marketing' && (!entry.marketingConsent || !entry.verifiedAt))
    ) {
      await db.mailMessage.deleteMany({ where: { id: claimed.id } });
      continue;
    }
    const payload = JSON.parse(unseal(claimed.payload)) as {
      url?: string;
      subject?: string;
      text?: string;
    };
    const text =
      claimed.kind === 'access'
        ? `Confirme seu e-mail e acesse a lista de espera VYVE:\n${payload.url}\n\nLink pessoal, de uso único, válido por 24 horas a partir da solicitação. Não compartilhe. Se você não solicitou, ignore esta mensagem.`
        : payload.text;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': claimed.id,
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM,
          to: [entry.email],
          subject: claimed.kind === 'access' ? 'Confirme seu e-mail — VYVE' : payload.subject,
          text,
        }),
      });
      if (!response.ok) throw new Error('PROVIDER_UNAVAILABLE');
      await db.mailMessage.updateMany({
        where: { id: claimed.id },
        data: { sentAt: new Date(), payload: '' },
      });
      console.log('[mail] sent');
    } catch {
      console.error('[mail] dispatch_failed; retry scheduled');
    }
  }
} finally {
  await db.$disconnect();
}
