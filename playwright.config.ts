import { defineConfig } from '@playwright/test';

const port = 3100;
const isProductionServer = process.env.PLAYWRIGHT_PRODUCTION === '1';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.pw.ts',
  outputDir: 'test-results/playwright',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    channel: 'chrome',
    colorScheme: 'light',
    locale: 'sq-AL',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  webServer: {
    command: isProductionServer
      ? `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`
      : `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.E2E_SUPABASE_URL ?? 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.E2E_SUPABASE_PUBLISHABLE_KEY
        ?? 'sb_publishable_e2e_placeholder',
    },
  },
});
