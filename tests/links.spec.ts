import { test, expect } from '@playwright/test';
import { pages, noindexPages } from './pages';

// Every internal link, image, stylesheet and script on every page must resolve.
// External links are not checked: sites like LinkedIn block bots and would fail for no reason.
// Links that point to a missing page on purpose (e.g. the CV button goes to /404
// until there is a PDF). Remove an entry here when the real target exists.
const INTENTIONAL_404 = ['/404'];

test.describe('internal links and assets', () => {
  for (const path of [...pages, ...noindexPages.filter((p) => p !== '/404.html')]) {
    test(path, async ({ page, request }) => {
      await page.goto(path);
      const origin = new URL(page.url()).origin;

      const urls = await page.evaluate(() =>
        [...document.querySelectorAll('a[href], img[src], link[href], script[src], source[src], iframe[src]')]
          .map((el) => (el as HTMLAnchorElement).href || (el as HTMLImageElement).src)
          .filter(Boolean),
      );

      const internal = [
        ...new Set(
          urls
            .map((u) => {
              const url = new URL(u);
              url.hash = '';
              return url;
            })
            .filter((url) => url.origin === origin && !INTENTIONAL_404.includes(url.pathname))
            .map((url) => url.toString()),
        ),
      ];

      expect(internal.length, 'found internal links on the page').toBeGreaterThan(0);

      for (const url of internal) {
        const response = await request.get(url);
        // Soft: report every broken link on the page, not just the first.
        expect.soft(response.status(), `${new URL(url).pathname} (linked from ${path})`).toBeLessThan(400);
      }
    });
  }
});
