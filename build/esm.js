import { rollup } from 'rollup';
import flow from 'rollup-plugin-flow';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from './config';
import { version } from '../package.json';

const inputOptions = {
  input: 'src/index.esm.js',
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
  format: 'es',
  banner: config.banner,
};

async function build () {
  console.log(chalk.cyan('Generating esm build...'));

  const bundle = await rollup(inputOptions);
  const { code } = await bundle.generate(outputOptions);

  fs.writeFileSync(path.join(config.outputFolder, 'vee-validate.esm.js'), code);
  console.log(chalk.green('Output File:') + ' vee-validate.esm.js');
}

build();
