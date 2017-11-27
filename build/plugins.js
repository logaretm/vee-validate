import { rollup } from 'rollup';
import flow from 'rollup-plugin-flow';
import uglify from 'uglify-js';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from './config';

let cache;

const pluginsDir = path.join(__dirname, '..', 'src/plugins');
const files = fs.readdirSync(pluginsDir);
async function build () {
  console.log(chalk.cyan('Building plugins...'));
  let i = 1;
  for (const file of files) {
    process.stdout.write(`${chalk.green(`Output File ${i}/${files.length}: `)} ${file}`);
    i++;
    const input = path.join(__dirname, '..', 'src/plugins/', file);
    const output = path.join(config.outputFolder, 'plugins', file);
    const bundle = await rollup({
      cache,
      input,
      external: ['VeeValidate'],
      plugins: [ flow(), buble(), resolve() ],
    });
    const { code } = await bundle.generate({
      format: 'umd',
      name: `__vee_validate_plugin_${file}`,
    });

    fs.writeFileSync(output, uglify.minify(code, config.uglifyOptions).code);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
}

build();
