import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pages, noindexPages, skipRedirectTimer } from './pages';

// WCAG 2.1 A/AA checks with axe-core, in both colour schemes,
// so a contrast problem in dark mode is caught as well.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`accessibility (${colorScheme})`, () => {
    test.use({ colorScheme });

    for (const path of [...pages, ...noindexPages]) {
      test(path, async ({ page }) => {
        // The 404 page sends visitors home after 5 s. Cancel only that timer
        // (faking all timers would also freeze axe-core, which uses setTimeout).
        if (path === '/404.html') await page.addInitScript(skipRedirectTimer);
        await page.goto(path);

        const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

        // Readable summary in the report: rule, description, and up to 3 offending elements.
        const summary = violations.map((v) => {
          const where = v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ');
          return `${v.id}: ${v.help} (${v.nodes.length}x) → ${where}`;
        });
        expect(summary, 'axe-core violations').toEqual([]);
      });
    }
  });
}
