const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const { paths } = require('./config');

const localesDir = path.join(__dirname, '..', 'locale');
const files = fs.readdirSync(localesDir);

async function build() {
  await mkdirp(path.join(paths.dist, 'locale'));
  // eslint-disable-next-line
  console.log(chalk.cyan('Building locales...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '..', 'locale', file);
    const out = path.join(paths.dist, 'locale', file);
    fs.copyFileSync(input, out);
    console.log('\n');
  }
}

build();
