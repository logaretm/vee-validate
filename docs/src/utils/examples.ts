import { Project } from '@stackblitz/sdk';
import { version } from '../../../packages/vee-validate/package.json';

export function getViteProjectConfig(files: Record<string, string>): Project {
  return {
    template: 'node',
    title: `vee-validate example`,
    files: {
      'package.json': `{
  "name": "vite-vue-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vee-validate/zod": "^${version}",
    "@vee-validate/yup": "^${version}",
    "@vee-validate/rules": "^${version}",
    "@vee-validate/i18n": "^${version}",
    "vee-validate": "^${version}",
    "vue": "^3.3.11",
    "yup": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "vite": "^4.3.9"
  }
}`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
      'src/main.js': `import { createApp } from 'vue'
      import App from './App.vue'

      createApp(App).mount('#app')
      `,
      'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
`,
      ...Object.fromEntries(Object.entries(files).map(([file, content]) => [`src/${file}`, content])),
    },
  };
}
