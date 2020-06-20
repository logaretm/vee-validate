const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const version = process.env.VERSION || require(path.resolve(__dirname, '../package.json')).version;

const commons = {
  banner: `/**
  * vee-validate v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  uglifyOptions: {
    compress: true,
    mangle: true,
  },
};

const formatNameMap = {
  core: 'VeeValidate',
  rules: 'VeeValidateRules',
  yup: 'VeeValidateYupAdapter',
  i18n: 'VeeValidateI18n',
};

const pkgNameMap = {
  core: 'vee-validate',
  rules: 'vee-validate-rules',
  yup: 'vee-validate-yup',
  i18n: 'vee-validate-i18n',
};

const formatMap = {
  es: 'esm',
  umd: '',
};

function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    tsconfigOverride: {
      exclude: ['**/tests'],
    },
  });

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.ts`),
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })],
    },
    output: {
      banner: commons.banner,
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
