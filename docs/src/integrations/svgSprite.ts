import path from 'path';
import { AstroIntegration } from 'astro';
import { writeFile } from 'fs-extra';

const integration: AstroIntegration = {
  name: 'svgSprite',
  hooks: {
    async 'astro:build:done'() {
      const iconModules = await import.meta.glob('../icons/*.svg', { as: 'raw' });

      const icons = await Promise.all(
        Object.keys(iconModules).map(k => {
          return iconModules[k]().then(content => {
            const id = k.split('/').pop().split('.').shift();

            return content.replace('<svg', `<symbol id="icon-${id}"`).replace('</svg>', '</symbol>');
          });
        }),
      );

      const sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="hidden">${icons.join(
        '\n',
      )}</svg>`;

      await writeFile(path.join(path.resolve(), '../docs/dist/sprite.svg'), sprite, { encoding: 'utf-8' });
    },
  },
};

export { integration as svgSprite };
