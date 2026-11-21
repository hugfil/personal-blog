import { readFileSync } from 'node:fs';

// Every public page comes from the built sitemap, so new posts, notes and
// projects are tested automatically without touching this file.
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

export const SITE = 'https://hugogoncalves.dev';

export const pages: string[] = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, loc]) => new URL(loc).pathname,
);

// Pages that exist but must stay out of search results.
export const noindexPages = ['/search/', '/404.html'];

// Runs in the page before its scripts: turns the 404 page's 5 s redirect into a no-op.
export function skipRedirectTimer() {
  const original = window.setTimeout;
  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) =>
    timeout === 5000 ? 0 : original(handler, timeout, ...args)) as typeof window.setTimeout;
}
