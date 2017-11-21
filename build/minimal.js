import { rollup } from 'rollup';
import flow from 'rollup-plugin-flow';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace'
import uglify from 'uglify-js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from './config';
import { version } from '../package.json';

const inputOptions = {
  input: 'src/index.minimal.js',
  plugins: [
    flow({ pretty: true }),
    replace({ __VERSION__: version }),
    resolve(),
    commonjs({
      include: 'node_modules/validator/**',
    }),
    buble(),
  ],
};
const outputOptions = {
  format: 'umd',
  name: 'VeeValidate',
  banner: config.banner,
};

async function build () {
  console.log(chalk.cyan('Generating minimal builds...'));

  const bundle = await rollup(inputOptions);
  const { code } = await bundle.generate(outputOptions);

  fs.writeFileSync(path.join(config.outputFolder, 'vee-validate.minimal.js'), code);
  console.log(chalk.green('Output File:') + ' vee-validate.minimal.js');

  fs.writeFileSync(path.join(config.outputFolder, 'vee-validate.minimal.min.js'), uglify.minify(code, config.uglifyOptions).code);
  console.log(chalk.green('Output File:') + ' vee-validate.minimal.min.js');
}

build();
