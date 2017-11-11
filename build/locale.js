import { rollup } from 'rollup';
import buble from 'rollup-plugin-buble';
import uglify from 'uglify-js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from './config';

const localesDir = path.join(__dirname, '..', 'locale');
const files = fs.readdirSync(localesDir);
let cache;

async function build () {
  console.log(chalk.cyan('Building locales...'));
  process.stdout.write(chalk.cyan('Test'));

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
