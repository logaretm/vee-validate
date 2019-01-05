const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(paths.dist);
  console.log(chalk.cyan('Generating esm build...'));
  await utils.writeBundle(configs.esm, 'vee-validate.esm.js');
  await utils.writeBundle(configs.esmMinimal, 'vee-validate.minimal.esm.js');
  await utils.writeBundle(configs.rules, 'rules.esm.js');
};

build();
