const { rollup } = require('rollup');
const flow = require('rollup-plugin-flow');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const config = require('./config');
const { version } = require('../package.json');

const mkdirp = promisify(mkdirpNode);

const inputOptions = {
  input: 'src/index.esm.js',
  plugins: [
    flow({ pretty: true }),
    replace({ __VERSION__: version }),
    resolve(),
    commonjs({
      include: 'node_modules/validator/**',
    }),
    buble()
  ],
};
const outputOptions = {
  format: 'es',
  banner: config.banner,
};

async function build () {
  await mkdirp(config.outputFolder);
  console.log(chalk.cyan('Generating esm build...'));

  let bundle = await rollup(inputOptions);
  let { code } = await bundle.generate(outputOptions);

  let outputPath = path.join(config.outputFolder, 'vee-validate.esm.js');
  fs.writeFileSync(outputPath, code);
  let stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.esm.js ${stats}`);

  inputOptions.input = 'src/index.minimal.esm.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;

  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.esm.js');
  fs.writeFileSync(outputPath, code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.esm.js ${stats}`);

  inputOptions.input = 'src/rules/index.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;
  outputPath = path.join(config.outputFolder, 'rules.esm.js');
  fs.writeFileSync(outputPath, code);

  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} rules.esm.js ${stats}`);
}

build();
