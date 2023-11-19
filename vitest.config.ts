import { defineConfig, configDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    globals: true,
    exclude: ['docs/*', ...configDefaults.exclude],
    coverage: {
      exclude: ['**/*/devtools.ts', 'packages/**/dist/**', 'docs/*', ...(configDefaults.coverage.exclude || [])],
    },
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
});
