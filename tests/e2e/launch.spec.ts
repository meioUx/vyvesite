import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { digest, unseal } from '../../src/lib/security';

test('verified referral, token replay protection, private dashboard and cascade deletion', async ({
  page,
  request,
}, testInfo) => {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  const prefix = `launch-${testInfo.project.name}-${Date.now()}`;
  const email = `${prefix}@example.invalid`;
  const origin = new URL(testInfo.project.use.baseURL!).origin;
  let referrerId = '';
  try {
    const referrer = await db.waitlistEntry.create({
      data: {
        email: `${prefix}-ref@example.invalid`,
        consent: true,
        consentVersion: 'test',
        verifiedAt: new Date(),
      },
    });
    referrerId = referrer.id;
    const signup = await request.post('/api/waitlist', {
      headers: { origin },
      data: { email, consent: true, referralCode: referrer.referralCode, source: 'referral' },
    });
    expect(signup.status()).toBe(200);
    const entry = await db.waitlistEntry.findUniqueOrThrow({ where: { email } });
    expect(entry.referredById).toBe(referrer.id);
    expect(entry.verifiedAt).toBeNull();
    const message = await db.mailMessage.findFirstOrThrow({ where: { entryId: entry.id } });
    const token = new URLSearchParams(
      new URL(JSON.parse(unseal(message.payload)).url).hash.slice(1),
    ).get('token')!;
    expect(await db.accessToken.findUnique({ where: { hash: digest(token) } })).not.toBeNull();
    await page.goto(`/confirmar#token=${token}`);
    await page.getByRole('button', { name: 'Confirmar meu e-mail' }).click();
    await expect(page).toHaveURL(/\/painel$/);
    await expect(page.getByRole('heading', { name: 'Seu convite, seu progresso' })).toBeVisible();
    expect(
      (await db.waitlistEntry.findUniqueOrThrow({ where: { email } })).verifiedAt,
    ).not.toBeNull();
    const replay = await request.post('/api/waitlist/verify', {
      headers: { origin },
      data: { token },
    });
    expect(replay.status()).toBe(400);
    expect((await request.get('/api/member')).status()).toBe(401);
    expect((await request.get('/api/admin')).status()).toBe(401);
    const crossOrigin = await page.request.post('/api/member', {
      headers: { origin: 'https://attacker.invalid' },
      data: { action: 'delete', confirmation: 'EXCLUIR' },
    });
    expect(crossOrigin.status()).toBe(400);
    await page.getByRole('button', { name: 'Começar desafio' }).click();
    await page.getByRole('button', { name: 'Registrar meu dia de movimento' }).click();
    await expect(page.getByText('1 de 30 dias registrados.')).toBeVisible();
    await page.getByLabel('Digite EXCLUIR para excluir seus dados').fill('EXCLUIR');
    await page.getByRole('button', { name: 'Excluir meus dados' }).click();
    await expect(page.getByText('Dados excluídos da base ativa.')).toBeVisible();
    expect(await db.waitlistEntry.count({ where: { id: entry.id } })).toBe(0);
    expect(await db.memberSession.count({ where: { entryId: entry.id } })).toBe(0);
    expect(await db.accessToken.count({ where: { entryId: entry.id } })).toBe(0);
    expect(await db.mailMessage.count({ where: { entryId: entry.id } })).toBe(0);
    expect(await db.challengeDay.count({ where: { entryId: entry.id } })).toBe(0);
  } finally {
    await db.waitlistEntry.deleteMany({ where: { OR: [{ email }, { id: referrerId }] } });
    await db.$disconnect();
  }
});
