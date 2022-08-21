import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import remarkGfm from 'remark-gfm';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import highlight from './highlight';
import baseLink from './baseLink';

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'production' ? 'https://vee-validate.logaretm.com/v4/' : 'http://localhost:3000/v4/',
  trailingSlash: 'always',
  integrations: [
    vue(),
    sitemap(),
    mdx({
      remarkPlugins: [baseLink('/v4'), highlight, remarkGfm],
    }),
  ],
});
