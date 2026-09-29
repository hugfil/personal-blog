import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each collection is just a folder of Markdown files under src/content/<name>/.
// To add a new post/project/note: drop a new .md file in the folder — that's it.

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Resume entries: one .md per job or degree. Sorted by `inicio` on the resume page.
// No `fim` = still ongoing. `logo` is a path under /public (e.g. /logos/empresa.svg).
const resume = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resume' }),
  schema: z.object({
    tipo: z.enum(['experiencia', 'formacao']),
    titulo: z.string(),
    local: z.string(),
    inicio: z.number(),
    fim: z.number().optional(),
    destaque: z.boolean().default(false),
    logo: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects, notes, resume };