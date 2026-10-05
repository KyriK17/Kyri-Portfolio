import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

const SITE_URL = 'https://kyrik.netlify.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    server: {
      allowedHosts: true,
    },
    plugins: [
      basicSsl(),
      tailwindcss(),
    ],
  },
});
