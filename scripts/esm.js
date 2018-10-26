const { rollup } = require('rollup');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(paths.dist);
  console.log(chalk.cyan('Generating esm build...'));

  let bundle = await rollup(configs.esm.input);
  let { code } = await bundle.generate(configs.esm.output);

  let outputPath = path.join(paths.dist, 'vee-validate.esm.js');
  fs.writeFileSync(outputPath, code);
  let stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.esm.js ${stats}`);

  bundle = await rollup(configs.esmMinimal.input);
  code = (await bundle.generate(configs.esmMinimal.output)).code;

  outputPath = path.join(paths.dist, 'vee-validate.minimal.esm.js');
  fs.writeFileSync(outputPath, code);
  stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.esm.js ${stats}`);

  bundle = await rollup(configs.rules.input);
  code = (await bundle.generate(configs.rules.output)).code;
  outputPath = path.join(paths.dist, 'rules.esm.js');
  fs.writeFileSync(outputPath, code);

  stats = utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} rules.esm.js ${stats}`);
}

build();
