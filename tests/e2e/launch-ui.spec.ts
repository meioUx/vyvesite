import { test, expect } from '@playwright/test';
test('participant panel is responsive and clearly distinguishes verified invites and inactive rewards', async ({
  page,
}, testInfo) => {
  await page.route('**/api/member', (route) =>
    route.fulfill({
      json: {
        referralCode: '11111111-1111-4111-8111-111111111111',
        referralUrl: 'https://example.invalid/?ref=11111111-1111-4111-8111-111111111111',
        verifiedInvites: 2,
        pendingInvites: 1,
        marketingConsent: false,
        migrationConsent: false,
        betaInvited: false,
        rewards: null,
        challengeStartedAt: null,
        days: [],
      },
    }),
  );
  await page.goto('/painel');
  await expect(page.getByRole('heading', { name: 'Seu convite, seu progresso' })).toBeVisible();
  await expect(page.getByText('Recompensas desativadas.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Excluir meus dados' })).toBeDisabled();
  await page.getByLabel('Digite EXCLUIR para excluir seus dados').fill('EXCLUIR');
  await expect(page.getByRole('button', { name: 'Excluir meus dados' })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await page.getByLabel('Digite EXCLUIR para excluir seus dados').blur();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-member.png`,
    fullPage: true,
  });
});
test('confirmation keeps the fragment credential through development effects and requires an explicit click', async ({
  page,
}) => {
  let attempts = 0;
  const token = 'a'.repeat(43);
  await page.route('**/api/waitlist/verify', async (route) => {
    attempts++;
    expect(route.request().postDataJSON()).toEqual({ token });
    await route.fulfill({ status: 400, json: { message: 'Link já utilizado.' } });
  });
  await page.goto(`/confirmar#token=${token}`);
  await expect(page.getByRole('button', { name: 'Confirmar meu e-mail' })).toBeEnabled();
  await expect(page).toHaveURL(/\/confirmar$/);
  expect(attempts).toBe(0);
  await page.getByRole('button', { name: 'Confirmar meu e-mail' }).click();
  await expect(page.getByText('Link já utilizado.')).toBeVisible();
  expect(attempts).toBe(1);
});
test('private pages do not expose data without a session', async ({ page, request }) => {
  expect((await request.get('/api/admin')).status()).toBe(401);
  expect((await request.get('/api/member')).status()).toBe(401);
  await page.goto('/admin');
  await expect(page.getByLabel('Senha administrativa')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aquisição e uso' })).toHaveCount(0);
  await page.goto('/confirmar');
  await expect(page.getByRole('button', { name: 'Confirmar meu e-mail' })).toBeDisabled();
});
