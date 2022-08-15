import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import highlight from './highlight';

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'production' ? 'https://vee-validate.logaretm.com/v4/' : 'http://localhost:3000/v4/',
  integrations: [
    vue(),
    sitemap(),
    mdx({
      remarkPlugins: [highlight],
    }),
  ],
});
