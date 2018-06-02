const { rollup } = require('rollup');
const flow = require('rollup-plugin-flow');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const nodent = require('rollup-plugin-nodent');
const uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const config = require('./config');
const { version } = require('../package.json');

const inputOptions = {
  input: 'src/index.js',
  plugins: [
    flow({ pretty: true }),
    replace({ __VERSION__: version }),
    resolve(),
    commonjs({
      include: 'node_modules/validator/**',
    }),
    nodent({ promises: true, noRuntime: true }),
    buble()
  ],
};
const outputOptions = {
  format: 'umd',
  name: 'VeeValidate',
  banner: config.banner,
};

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(config.outputFolder);
  console.log(chalk.cyan('Generating main builds...'));

  let bundle = await rollup(inputOptions);
  let { code } = await bundle.generate(outputOptions);

  // generate main bundle.
  let outputPath = path.join(config.outputFolder, 'vee-validate.js');
  fs.writeFileSync(outputPath, code);
  let stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.js ${stats}`);

  // generate minified bundle.
  outputPath = path.join(config.outputFolder, 'vee-validate.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, config.uglifyOptions).code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.min.js ${stats}`);

  inputOptions.input = 'src/index.minimal.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;

  // generate minimal bundle
  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.js');
  fs.writeFileSync(outputPath, code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);

  // generate minified minimal bundle.
  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, config.uglifyOptions).code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);
}

build();
