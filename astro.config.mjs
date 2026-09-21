import { defineConfig } from 'astro/config';

export default defineConfig({
  // Custom domain — GitHub Pages will serve this via the CNAME file in /public.
  // No `base` needed since we're not using a project-pages subpath.
  site: 'https://github.io',
  base: 'personal-blog',

  devToolbar: {
    enabled: false,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
