const fs = require('fs');
const path = require('path');
const mkdirpNode = require('mkdirp');
const { promisify } = require('util');
const chalk = require('chalk');

const mkdirp = promisify(mkdirpNode);

async function build() {
  const localesDir = path.join(__dirname, '..', 'src');
  const files = fs.readdirSync(localesDir);
  await mkdirp(path.join(__dirname, '..', 'dist'));
  // eslint-disable-next-line
  console.log(chalk.cyan('Building locales...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '..', 'src', file);
    const out = path.join(__dirname, '..', 'dist', file);
    fs.copyFileSync(input, out);
  }
}

build();
