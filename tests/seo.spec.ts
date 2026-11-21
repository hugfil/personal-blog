import { test, expect } from '@playwright/test';
import { pages, noindexPages, SITE, skipRedirectTimer } from './pages';

// Guards the SEO work: every public page keeps its title, description,
// canonical URL, preview image and a single <h1>.
test.describe('SEO: public pages', () => {
  for (const path of pages) {
    test(path, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), 'HTTP status').toBe(200);

      await expect(page).toHaveTitle(/\S/);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.trim().length, 'meta description length').toBeGreaterThan(0);
      expect(description!.length, 'meta description should fit in search results').toBeLessThanOrEqual(160);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/hugogoncalves\.dev\//);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      await expect(page.locator('h1'), 'exactly one <h1>').toHaveCount(1);
    });
  }
});

test.describe('SEO: pages kept out of search', () => {
  for (const path of noindexPages) {
    test(path, async ({ page }) => {
      // The 404 page sends visitors home after 5 s. Cancel only that timer
      // (faking all timers with page.clock would also freeze the page's other scripts).
      if (path === '/404.html') await page.addInitScript(skipRedirectTimer);
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    });
  }
});

test('robots.txt points to the sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});
