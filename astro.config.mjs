import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config.ts';

export default defineConfig({
  site: site.url,
  output: 'static',
  integrations: [react(), sitemap()],
  build: { inlineStylesheets: 'auto' }
});
