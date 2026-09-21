# hugogoncalves.xyz

Personal site built with [Astro](https://astro.build). Content lives as
Markdown files — no CMS, no database.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
```

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Adding content

Everything is a Markdown file with frontmatter. No code changes needed.

**New blog post** → add a file to `src/content/blog/`, e.g.
`src/content/blog/my-new-post.md`:

```markdown
---
title: "My New Post"
description: "One-line summary."
pubDate: 2026-09-20
tags: ["life"]
---

Body goes here, in Markdown.
```

**New project** → add a file to `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "What it does."
pubDate: 2026-09-20
url: "https://example.com"      # optional, live link
repo: "https://github.com/you/repo"  # optional
tags: ["rust"]
---

Longer write-up.
```

**New note** → add a file to `src/content/notes/`:

```markdown
---
title: "TIL something"
pubDate: 2026-09-20
tags: ["til"]
---

Short note.
```

The filename (minus `.md`) becomes the URL slug, e.g.
`src/content/blog/my-new-post.md` → `/blog/my-new-post/`.

Set `draft: true` in frontmatter to hide an entry without deleting it.

## Editing static pages

- Homepage intro: `src/pages/index.astro`
- Avatar photo: currently a random placeholder photo from
  `pravatar.cc` just to preview the layout — replace it with your own image
  (drop a file in `public/`, e.g. `public/avatar.jpg`) and update the `src`
  in `src/pages/index.astro` to `/avatar.jpg`
- About: `src/pages/about.astro`
- Resume: `src/pages/resume.astro` (put a PDF at `public/resume.pdf` to make
  the download link work)
- Nav links / site title: `src/components/Header.astro`
- Footer social links: `src/components/Footer.astro` (LinkedIn URL, RSS)
- Search: `src/pages/search.astro` (client-side, filters `src/pages/search-index.json.js`, which auto-includes every blog post and note — no setup needed when you add new content). Tag pills on each post/note link here with `?tag=`, and the search page also has clickable tag filters.
- Fonts: Roboto, loaded from Google Fonts in `src/layouts/BaseLayout.astro`
- Markdown: full support in every post/project/note, including tables, blockquotes, and syntax-highlighted code blocks (dual light/dark themes configured in `astro.config.mjs`)
- Colors / spacing / fonts: `src/styles/global.css`

## Deploying (GitHub Pages)

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
the site automatically on every push to `main`.

One-time setup on GitHub:

1. Push this repo to GitHub (e.g. `hugfil/hugogoncalves.xyz` or any name you
   like).
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. If you're using a custom domain (this repo is pre-configured for
   `www.hugogoncalves.xyz` via `public/CNAME` and `astro.config.mjs`), go to
   **Settings → Pages → Custom domain** and confirm it, and make sure your
   DNS has the right records pointing at GitHub Pages (a `CNAME` record for
   `www` pointing to `<username>.github.io`, or `A`/`ALIAS` records for the
   apex domain — see
   [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
4. If you *don't* want a custom domain and are fine with
   `<username>.github.io/<repo-name>/`, remove `public/CNAME`, change `site`
   in `astro.config.mjs` to `https://<username>.github.io`, and add
   `base: '/<repo-name>'`.

After that: `git push` → Actions builds the site → it's live. No manual
deploy step.
