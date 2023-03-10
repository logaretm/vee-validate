import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatNameMap = {
  'vee-validate': 'VeeValidate',
  rules: 'VeeValidateRules',
  i18n: 'VeeValidateI18n',
  zod: 'VeeValidateZod',
  yup: 'VeeValidateYup',
};

const pkgNameMap = {
  'vee-validate': 'vee-validate',
  rules: 'vee-validate-rules',
  i18n: 'vee-validate-i18n',
  zod: 'vee-validate-zod',
  yup: 'vee-validate-yup',
};

const formatMap = {
  es: 'esm',
  umd: '',
};

console.log(path.resolve(__dirname, '../tsconfig.json'));

async function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      exclude: ['**/tests'],
    },
  });

  // An import assertion in a dynamic import
  const { default: info } = await import(path.resolve(__dirname, `../packages/${pkg}/package.json`), {
    assert: {
      type: 'json',
    },
  });

  const { version } = info;

  const isEsm = format === 'es';

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.ts`),
      external: ['vue', isEsm ? '@vue/devtools-api' : undefined, 'zod'].filter(Boolean),
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            __VERSION__: version,
            __DEV__: isEsm ? `(process.env.NODE_ENV !== 'production')` : 'false',
          },
        }),
        tsPlugin,
        resolve({
          dedupe: ['klona', 'klona/full'],
        }),
        commonjs(),
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

export { formatNameMap, pkgNameMap, formatMap, createConfig };
