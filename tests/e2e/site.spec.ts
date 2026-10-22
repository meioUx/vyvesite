import { test, expect } from '@playwright/test';
import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
test('complete signup persists one normalized row and duplicate is private', async ({
  page,
  request,
}, testInfo) => {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  const email = `e2e-${testInfo.project.name}-${Date.now()}@example.invalid`;
  try {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Quero acesso/ })
      .first()
      .click();
    await page.getByLabel('Seu melhor e-mail').fill(email);
    await page.getByRole('checkbox').first().check();
    await page.getByRole('button', { name: 'Quero fazer parte' }).click();
    await expect(page.getByRole('heading', { name: 'Você deu o primeiro passo.' })).toBeVisible();
    expect(await db.waitlistEntry.count({ where: { email } })).toBe(1);
    const response = await request.post('/api/waitlist', {
      data: { email: email.toUpperCase(), name: 'Different', consent: true },
    });
    expect(response.status()).toBe(200);
    expect(await db.waitlistEntry.count({ where: { email } })).toBe(1);
    expect((await db.waitlistEntry.findUnique({ where: { email } }))?.name).toBeNull();
  } finally {
    await db.waitlistEntry.deleteMany({ where: { email } });
    await db.$disconnect();
  }
});
test('interactions, responsive layout and official images', async ({ page, request }, testInfo) => {
  for (const path of ['/termos', '/contato', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).status()).toBe(200);
  }
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
    await page.getByRole('button', { name: 'Fechar menu' }).click();
  }
  await page.getByRole('button', { name: /Extremo/ }).click();
  await expect(page.getByText('Modo Extremo: progressão de +12%', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: /Diamante/ }).click();
  await expect(page.getByRole('heading', { name: /Diamante/ })).toBeVisible();
  await page.getByRole('button', { name: 'Treinos 05' }).click();
  await expect(page.getByRole('heading', { name: 'VYVE Pro' })).toBeVisible();
  const medalFilters = page.getByRole('group', { name: 'Coleção de medalhas' }).getByRole('button');
  await expect(medalFilters).toHaveCount(9);
  for (const filter of await medalFilters.all()) {
    await filter.click();
    await expect(page.getByRole('img', { name: /^Medalha oficial / })).toHaveCount(5);
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.locator('.waitlist-copy').scrollIntoViewIfNeeded();
  await expect(page.locator('.waitlist-copy')).toHaveCSS('opacity', '1');
  await page
    .locator('#lista-de-espera')
    .screenshot({ path: `test-results/${testInfo.project.name}-waitlist.png` });
  await page.locator('#email').fill('invalid');
  await page.getByRole('button', { name: 'Quero fazer parte' }).click();
  await expect(page.getByText('Digite um e-mail válido.')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png`, fullPage: true });
  const failedImages = await page
    .locator('img')
    .evaluateAll(
      (images) =>
        images.filter(
          (img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth === 0,
        ).length,
    );
  expect(failedImages).toBe(0);
});
