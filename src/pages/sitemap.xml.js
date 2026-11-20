import { getCollection } from 'astro:content';

// Sitemap for search engines, built from the pages and the content collections.
// When you add a new standalone page in src/pages/, add its path to STATIC_PAGES.
// /search/ and /404 are left out on purpose (noindex).
const STATIC_PAGES = ['/', '/about/', '/blog/', '/notes/', '/projects/', '/resume/'];

export async function GET(context) {
  const site = context.site;
  const published = ({ data }) => !data.draft;

  const [posts, notes, projects] = await Promise.all([
    getCollection('blog', published),
    getCollection('notes', published),
    getCollection('projects', published),
  ]);

  const entries = [
    ...STATIC_PAGES.map((path) => ({ path })),
    ...posts.map((p) => ({ path: `/blog/${p.id}/`, lastmod: p.data.updatedDate ?? p.data.pubDate })),
    ...notes.map((n) => ({ path: `/notes/${n.id}/`, lastmod: n.data.pubDate })),
    ...projects.map((p) => ({ path: `/projects/${p.id}/`, lastmod: p.data.pubDate })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(path, site).toString();
      const last = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${last}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
