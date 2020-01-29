const chalk = require('chalk');
const mkdirp = require('mkdirp');
const { configs, utils, paths } = require('./config');

async function build() {
  await mkdirp(paths.dist);
  // eslint-disable-next-line
  console.log(chalk.cyan('Generating ESM builds...'));
  await utils.writeBundle(configs.esm, 'vee-validate.esm.js');
  await utils.writeBundle(configs.esmFull, 'vee-validate.full.esm.js');
  await utils.writeBundle(configs.rules, 'rules.js');
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));

  // eslint-disable-next-line
  console.log(chalk.cyan('Generating UMD build...'));
  await utils.writeBundle(configs.umd, 'vee-validate.js', true);
  await utils.writeBundle(configs.umdFull, 'vee-validate.full.js', true);
  await utils.writeBundle(configs.rulesUmd, 'rules.umd.js', true);
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));
}

build();
