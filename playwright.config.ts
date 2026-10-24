import { defineConfig } from '@playwright/test';

// CHROMIUM_PATH lets you point at an existing Chromium; otherwise run `npx playwright install chromium`.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321/en/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Fake public values so the backend code paths are active; every request is mocked in the tests.
    env: { PUBLIC_SUPABASE_URL: 'https://test.supabase.co', PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key' },
  },
});
