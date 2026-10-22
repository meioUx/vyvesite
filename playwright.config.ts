import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3002';
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    reducedMotion: process.env.TEST_MOTION === '1' ? 'no-preference' : 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    command: process.env.E2E_PRODUCTION
      ? `npm run start -- --port ${new URL(baseURL).port}`
      : `npm run dev -- --port ${new URL(baseURL).port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
