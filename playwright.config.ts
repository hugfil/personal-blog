import { defineConfig, devices } from '@playwright/test';

// Tests run against the built site (dist/) served by `astro preview`.
// Run `npm run build` first; `npm test` runs links + Playwright + Lighthouse.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Locally (Windows laptop) too many parallel browsers caused crashes and
  // timeouts, so cap them; CI keeps Playwright's default.
  workers: process.env.CI ? undefined : 2,
  // axe-core on the longer pages (resume, home) can take a while.
  timeout: 60_000,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
