const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const formatNameMap = {
  'vee-validate': 'VeeValidate',
  rules: 'VeeValidateRules',
  i18n: 'VeeValidateI18n',
  zod: 'VeeValidateZod',
};

const pkgNameMap = {
  'vee-validate': 'vee-validate',
  rules: 'vee-validate-rules',
  i18n: 'vee-validate-i18n',
  zod: 'vee-validate-zod',
};

const formatMap = {
  es: 'esm',
  umd: '',
};

function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      exclude: ['**/tests'],
    },
  });

  const version = require(path.resolve(__dirname, `../packages/${pkg}/package.json`)).version;
  const isEsm = format === 'es';

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.ts`),
      external: ['vue', '@vue/devtools-api'],
      plugins: [
        tsPlugin,
        resolve({
          dedupe: ['fast-deep-equal/es6', 'fast-deep-equal', 'klona', 'klona/lite'],
        }),
        commonjs(),
        replace({
          __VERSION__: version,
          __VUE_PROD_DEVTOOLS__: isEsm ? '__VUE_PROD_DEVTOOLS__' : 'true',
          'process.env.NODE_ENV': isEsm ? 'process.env.NODE_ENV' : JSON.stringify('production'),
        }),
      ],
    },
    output: {
      banner: `/**
  * vee-validate v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue',
      },
    },
  };

  config.bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatMap,
  createConfig,
};
