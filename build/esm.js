import { rollup } from 'rollup';
import flow from 'rollup-plugin-flow';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import nodent from 'rollup-plugin-nodent';
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
    nodent({ promises: true, noRuntime: true }),
    buble()
  ],
};
const outputOptions = {
  format: 'es',
  banner: config.banner,
};

async function build () {
  console.log(chalk.cyan('Generating esm build...'));

  let bundle = await rollup(inputOptions);
  let { code } = await bundle.generate(outputOptions);

  let outputPath = path.join(config.outputFolder, 'vee-validate.esm.js');
  fs.writeFileSync(outputPath, code);
  let stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.esm.js ${stats}`);

  inputOptions.input = 'src/index.minimal.esm.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;

  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.esm.js');
  fs.writeFileSync(outputPath, code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.esm.js ${stats}`);

  inputOptions.input = 'src/rules/index.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;
  outputPath = path.join(config.outputFolder, 'rules.esm.js');
  fs.writeFileSync(outputPath, code);

  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} rules.esm.js ${stats}`);
}

build();
