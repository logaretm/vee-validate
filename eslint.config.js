import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'error',
    },
  },
  {
    files: ['scripts/**/*'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ['docs/scripts/**/*', 'docs/*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['scripts/**/*', 'packages/**/*.spec.ts'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'packages/vee-validate/dist/*',
      'packages/yup/dist/*',
      'packages/zod/dist/*',
      'packages/valibot/dist/*',
      'packages/joi/dist/*',
      'packages/rules/dist/*',
      'packages/i18n/dist/*',
      'packages/nuxt/dist/*',
    ],
  },
);
