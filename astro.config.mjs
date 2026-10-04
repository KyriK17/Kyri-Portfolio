// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// IMPORTANT: change this to your real address once you know it
// (for example https://kyri.pages.dev or your own domain).
// It is used for canonical URLs, the sitemap and social-sharing images.
const SITE_URL = 'https://your-site.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
