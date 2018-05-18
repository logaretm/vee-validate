import { rollup } from 'rollup';
import buble from 'rollup-plugin-buble';
import uglify from 'uglify-js';
import fs from 'fs';
import path from 'path';
import mkdirpNode from 'mkdirp';
import { promisify } from 'util';
import chalk from 'chalk';
import config from './config';

const localesDir = path.join(__dirname, '..', 'locale');
const files = fs.readdirSync(localesDir);
let cache;

const mkdirp = promisify(mkdirpNode);

async function build () {
  await mkdirp(path.join(config.outputFolder, 'locale'));
  console.log(chalk.cyan('Building locales...'));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);

    // ignore utils file.
    if (/utils/.test(file)) continue;

    const input = path.join(__dirname, '..', 'locale', file);
    const output = path.join(config.outputFolder, 'locale', file);

    const bundle = await rollup({
      cache,
      input,
      external: ['VeeValidate'],
      plugins: [ buble() ],
    });
    const { code } = await bundle.generate({
      format: 'umd',
      name: `__vee_validate_locale__${file}`,
    });

    fs.writeFileSync(output, uglify.minify(code, config.uglifyOptions).code);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

build();
