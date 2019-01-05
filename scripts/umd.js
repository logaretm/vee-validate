const chalk = require('chalk');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(paths.dist);
  console.log(chalk.cyan('Generating main builds...'));
  await utils.writeBundle(configs.umdDev, 'vee-validate.js', true);

  await utils.writeBundle(configs.umdMinimalProd, 'vee-validate.minimal.js', true);
}

build();
