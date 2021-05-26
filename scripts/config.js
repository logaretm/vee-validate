const path = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const filesize = require('filesize');
const Terser = require('terser');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const typescript = require('rollup-plugin-typescript2');
const json = require('rollup-plugin-json');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const version = process.env.VERSION || require('../package.json').version;

const commons = {
  banner: `/**
  * vee-validate v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  outputFolder: path.join(__dirname, '..', 'dist'),
  uglifyOptions: {
    compress: true,
    mangle: true
  }
};

const paths = {
  dist: commons.outputFolder
};

const utils = {
  stats({ path, code }) {
    const { size } = fs.statSync(path);
    const gzipped = gzipSize.sync(code);

    return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
  },
  async writeBundle({ input, output }, fileName, minify = false) {
    try {
      const bundle = await rollup(input);
      const {
        output: [{ code }]
      } = await bundle.generate(output);

      let outputPath = path.join(paths.dist, fileName);
      fs.writeFileSync(outputPath, code);
      let stats = this.stats({ code, path: outputPath });
      // eslint-disable-next-line
      console.log(`${chalk.green('Output File:')} ${fileName} ${stats}`);

      if (minify) {
        const minifiedFileName = fileName.replace('.js', '') + '.min.js';
        outputPath = path.join(paths.dist, minifiedFileName);
        const { code: minifiedCode } = await Terser.minify(code, {
          compress: true,
          mangle: true
        });
        fs.writeFileSync(outputPath, minifiedCode);
        stats = this.stats({ code, path: outputPath });
        // eslint-disable-next-line
        console.log(`${chalk.green('Output File:')} ${minifiedFileName} ${stats}`);
      }
    } catch (err) {
      console.log(err);
    }

    return true;
  }
};

const builds = {
  umd: {
    input: 'src/index.ts',
    format: 'umd',
    name: 'VeeValidate',
    env: 'production'
  },
  umdFull: {
    input: 'src/index.full.ts',
    format: 'umd',
    name: 'VeeValidate',
    env: 'production'
  },
  esm: {
    input: 'src/index.ts',
    format: 'es'
  },
  esmFull: {
    input: 'src/index.full.ts',
    format: 'es'
  },
  rules: {
    input: 'src/rules/index.ts',
    format: 'es'
  },
  rulesUmd: {
    input: 'src/rules/index.ts',
    format: 'umd',
    name: 'VeeValidateRules'
  }
};

function genConfig(options) {
  const config = {
    input: {
      input: options.input,
      external: ['vue'],
      plugins: [
        json(),
        typescript({ typescript: require('typescript'), useTsconfigDeclarationDir: true }),
        commonjs(),
        resolve({
          dedupe: ['fast-deep-equal/es6', 'fast-deep-equal']
        }),
        replace({ __VERSION__: version })
      ]
    },
    output: {
      banner: commons.banner,
      format: options.format,
      name: options.name,
      globals: {
        vue: 'Vue'
      }
    }
  };

  if (options.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(options.env)
      })
    );
  }

  return config;
}

const configs = Object.keys(builds).reduce((prev, key) => {
  prev[key] = genConfig(builds[key]);

  return prev;
}, {});

module.exports = {
  configs,
  utils,
  uglifyOptions: commons.uglifyOptions,
  paths
};
