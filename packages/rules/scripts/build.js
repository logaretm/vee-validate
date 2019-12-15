const chalk = require('chalk');
const path = require('path');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const { configs, utils, paths } = require('./config');

const mkdirp = promisify(mkdirpNode);

async function build() {
  await mkdirp(paths.dist);
  // eslint-disable-next-line
  console.log(chalk.cyan('Generating ESM builds...'));
  await utils.writeBundle(configs.rules, 'rules.esm.js');
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));

  // eslint-disable-next-line
  console.log(chalk.cyan('Generating UMD build...'));
  await utils.writeBundle(configs.rulesUmd, 'rules.js', true);
  // eslint-disable-next-line
  console.log(chalk.cyan('Done!'));
}

async function buildLocales() {
  const localesDir = path.join(__dirname, '..', 'i18n');
  const files = fs.readdirSync(localesDir);
  await mkdirp(path.join(paths.dist, 'i18n'));
  // eslint-disable-next-line
  console.log(chalk.cyan('Building i18n...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    const input = path.join(__dirname, '..', 'i18n', file);
    const out = path.join(paths.dist, 'i18n', file);
    fs.copyFileSync(input, out);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

build()
  .catch(console.log)
  .then(buildLocales);
