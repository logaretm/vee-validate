const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const flow = require('rollup-plugin-flow');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const version = process.env.VERSION || require('../package.json').version;

const commons = {
  banner:
    `/**
  * vee-validate v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
  outputFolder: path.join(__dirname, '..', 'dist'),
  uglifyOptions: {
    compress: true,
    mangle: true,
  },
  utils: {
    stats ({ path, code }) {
      const { size } = fs.statSync(path);
      const gzipped = gzipSize.sync(code);

      return `| Size: ${filesize(size)} | Gzip: ${filesize(gzipped)}`;
    }
  }
};

const builds = {
  umdDev: {
    input: 'src/index.js',
    format: 'umd',
    name: 'VeeValidate',
    env: 'development'
  },
  umdProd: {
    input: 'src/index.js',
    format: 'umd',
    name: 'VeeValidate',
    env: 'production'
  },
  umdMinimalDev: {
    input: 'src/index.minimal.js',
    format: 'umd',
    name: 'VeeValidate',
    env: 'development'
  },
  umdMinimalProd: {
    input: 'src/index.minimal.js',
    format: 'umd',
    name: 'VeeValidate',
    env: 'production'
  },
  esm: {
    input: 'src/index.esm.js',
    format: 'es'
  },
  esmMinimal: {
    input: 'src/index.minimal.esm.js',
    format: 'es'
  },
  rules: {
    input: 'src/rules/index.js',
    format: 'es'
  }
};

function genConfig (options) {
  const config = {
    input: {
      input: options.input,
      plugins: [
        flow({ pretty: true }),
        replace({ __VERSION__: version }),
        resolve(),
        commonjs({
          include: 'node_modules/validator/**',
        }),
        buble()
      ]
    },
    output: {
      banner: commons.banner,
      format: options.format,
      name: options.name
    }
  };

  if (options.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(options.env)
    }));
  }

  return config;
};

const configs = Object.keys(builds).reduce((prev, key) => {
  prev[key] = genConfig(builds[key]);

  return prev;
}, {});

module.exports = {
  configs,
  utils: commons.utils,
  uglifyOptions: commons.uglifyOptions,
  paths: {
    dist: commons.outputFolder
  },
};
