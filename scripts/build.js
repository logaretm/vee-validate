const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const mkdirp = require('util').promisify(require('mkdirp'));

const { build } = require('../rollup.config');

async function buildLocales() {
  const localesDir = path.join(__dirname, '../packages/rules/i18n');
  const files = fs.readdirSync(localesDir);
  await mkdirp(path.join(__dirname, '../packages/rules/dist/i18n'));
  // eslint-disable-next-line
  console.log(chalk.cyan('Building i18n...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    const input = path.join(__dirname, '../packages/rules/i18n', file);
    const out = path.join(__dirname, '../packages/rules/dist/i18n', file);
    fs.copyFileSync(input, out);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

(async function Bundle() {
  await build('rules');
  await buildLocales();
  await build('core');
})();
