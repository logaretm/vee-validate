import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import remarkGfm from 'remark-gfm';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import highlight from './highlight';
import baseLink from './baseLink';
import { svgSprite } from './src/integrations/svgSprite';

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'production' ? 'https://vee-validate.logaretm.com/' : 'http://localhost:4321/',
  trailingSlash: 'always',
  base: '/v4',
  integrations: [
    vue(),
    sitemap(),
    mdx({
      remarkPlugins: [baseLink('/v4'), highlight, remarkGfm],
    }),
    svgSprite,
  ],
});
