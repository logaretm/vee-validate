const path = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const filesize = require('filesize');
const uglify = require('uglify-js');
const chalk = require('chalk');
const gzipSize = require('gzip-size');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');
const version = process.env.VERSION || require('../package.json').version;

const commons = {
  banner: `/**
  * @vee-validate/rules v${version}
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
      fs.writeFileSync(outputPath, uglify.minify(code, commons.uglifyOptions).code);
      stats = this.stats({ code, path: outputPath });
      // eslint-disable-next-line
      console.log(`${chalk.green('Output File:')} ${minifiedFileName} ${stats}`);
    }

    return true;
  }
};

const builds = {
  rules: {
    input: 'src/index.ts',
    format: 'es'
  },
  rulesUmd: {
    input: 'src/index.ts',
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
        typescript({ typescript: require('typescript'), useTsconfigDeclarationDir: true }),
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
