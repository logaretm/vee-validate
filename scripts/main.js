const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(paths.dist);
  // eslint-disable-next-line
  console.log(chalk.cyan('Generating ESM builds...'));
  await utils.writeBundle(configs.esm, 'vee-validate.esm.js');
  await utils.writeBundle(configs.esmMinimal, 'vee-validate.minimal.esm.js');
  await utils.writeBundle(configs.rules, 'rules.esm.js');
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));

  // eslint-disable-next-line
  console.log(chalk.cyan('Generating UMD build...'));
  await utils.writeBundle(configs.umd, 'vee-validate.js', true);
  await utils.writeBundle(configs.umdMinimal, 'vee-validate.minimal.js', true);
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));
};

build();
