import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://eltianguis.sistemia.mx',
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/unsubscribe'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
