import { getCollection } from 'astro:content';

export async function GET() {
  const [posts, notes] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  const index = [
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.pubDate,
      url: `/blog/${p.id}/`,
      type: 'blog',
      tags: p.data.tags ?? [],
    })),
    ...notes.map((n) => ({
      title: n.data.title,
      description: '',
      pubDate: n.data.pubDate,
      url: `/notes/${n.id}/`,
      type: 'note',
      tags: n.data.tags ?? [],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
