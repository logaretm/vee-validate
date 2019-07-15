const fs = require('fs');
const path = require('path');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const chalk = require('chalk');
const { paths, uglifyOptions } = require('./config');

const localesDir = path.join(__dirname, '..', 'locale');
const files = fs.readdirSync(localesDir);

const mkdirp = promisify(mkdirpNode);

async function build() {
  await mkdirp(path.join(paths.dist, 'locale'));
  // eslint-disable-next-line
  console.log(chalk.cyan('Building locales...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '..', 'locale', file);
    const out = path.join(paths.dist, 'locale', file);
    fs.copyFileSync(input, out);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

build();
