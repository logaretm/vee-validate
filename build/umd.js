import { rollup } from 'rollup';
import flow from 'rollup-plugin-flow';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import nodent from 'rollup-plugin-nodent';
import uglify from 'uglify-js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from './config';
import { version } from '../package.json';

const inputOptions = {
  input: 'src/index.js',
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
  format: 'umd',
  name: 'VeeValidate',
  banner: config.banner,
};

async function build () {
  console.log(chalk.cyan('Generating main builds...'));

  let bundle = await rollup(inputOptions);
  let { code } = await bundle.generate(outputOptions);

  // generate main bundle.
  let outputPath = path.join(config.outputFolder, 'vee-validate.js');
  fs.writeFileSync(outputPath, code);
  let stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.js ${stats}`);

  // generate minified bundle.
  outputPath = path.join(config.outputFolder, 'vee-validate.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, config.uglifyOptions).code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.min.js ${stats}`);

  inputOptions.input = 'src/index.minimal.js';
  bundle = await rollup(inputOptions);
  code = (await bundle.generate(outputOptions)).code;

  // generate minimal bundle
  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.js');
  fs.writeFileSync(outputPath, code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);

  // generate minified minimal bundle.
  outputPath = path.join(config.outputFolder, 'vee-validate.minimal.min.js');
  fs.writeFileSync(outputPath, uglify.minify(code, config.uglifyOptions).code);
  stats = config.utils.stats({ code, path: outputPath });
  console.log(`${chalk.green('Output File:')} vee-validate.minimal.js ${stats}`);
}

build();
