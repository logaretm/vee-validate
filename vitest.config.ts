import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    globals: true,
    exclude: ['docs/*', ...configDefaults.exclude],
    alias: [{ find: /@\/(.+)/, replacement: './packages/$1/src' }],
    coverage: {
      exclude: ['**/*/devtools.ts', 'packages/**/dist/**', 'docs/*', ...(configDefaults.coverage.exclude || [])],
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});
