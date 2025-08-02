import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { normalizePath, slashes } from './normalize-path.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const formatNameMap = {
  'vee-validate': 'VeeValidate',
  rules: 'VeeValidateRules',
  i18n: 'VeeValidateI18n',
};

const pkgNameMap = {
  'vee-validate': 'vee-validate',
  rules: 'vee-validate-rules',
  i18n: 'vee-validate-i18n',
};

const formatExt = {
  esm: 'mjs',
  iife: 'iife.js',
  cjs: 'cjs',
};

async function createConfig(pkg, format) {
  const tsPlugin = typescript({
    declarationDir: normalizePath(path.resolve(__dirname, `../packages/${pkg}/dist`)),
  });

  // An import assertion in a dynamic import
  const { default: info } = await import(normalizePath(path.resolve(__dirname, `../packages/${pkg}/package.json`)), {
    with: {
      type: 'json',
    },
  });

  const { version } = info;

  const isEsm = format === 'esm';

  const config = {
    input: {
      input: slashes(path.resolve(__dirname, `../packages/${pkg}/src/index.ts`)),
      external: [
        'vue',
        isEsm ? '@vue/devtools-api' : undefined,
        isEsm ? '@vue/devtools-kit' : undefined,
        'vee-validate',
      ].filter(Boolean),
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
      name: format === 'iife' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue',
        'vee-validate': 'VeeValidate',
      },
    },
  };

  config.bundleName = `${pkgNameMap[pkg]}.${formatExt[format] ?? 'js'}`;

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

export { formatNameMap, pkgNameMap, formatExt, createConfig };
