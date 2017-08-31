const Rollup = require('rollup');
const Uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');
const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const chalk = require('chalk');
const version = require('../package.json').version;

const outputFolder = path.join(__dirname, '/../', 'dist');

async function main () {
  console.log(chalk.cyan('Generating main builds...'));
  const bundle = await Rollup.rollup({
    input: 'src/index.js',
    plugins: [
      replace({ __VERSION__: version }),
      nodeResolve(),
      commonjs(),
      buble(),
    ],
  });

  const { code } = await bundle.generate({
    format: 'umd',
    name: 'VeeValidate',
    banner:
    `/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
  });

  const output = path.join(outputFolder, 'vee-validate.js');
  fs.writeFileSync(output, code);
  console.log(chalk.green('Output File:') + ' vee-validate.js');
  fs.writeFileSync(path.join(outputFolder, 'vee-validate.min.js'), Uglify.minify(code, {
    compress: true,
    mangle: true,
  }).code);
  console.log(chalk.green('Output File:') + ' vee-validate.min.js');
}

async function minimal () {
  console.log(chalk.cyan('Generating minimal builds...'));

  const bundle = await Rollup.rollup({
    input: 'src/minimal.js',
    plugins: [
      replace({ __VERSION__: version }),
      nodeResolve(),
      commonjs(),
      buble()
    ],
  });

  const { code } = await bundle.generate({
    format: 'umd',
    name: 'VeeValidate',
    banner:
`/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
  });

  let output = path.join(outputFolder, 'vee-validate.minimal.js');
  fs.writeFileSync(output, code);
  console.log(chalk.green('Output File:') + ' vee-validate.minimal.js');
  fs.writeFileSync(path.join(outputFolder, 'vee-validate.minimal.min.js'), Uglify.minify(code, {
    compress: true,
    mangle: true,
  }).code);
  console.log(chalk.green('Output File:') + ' vee-validate.minimal.min.js');

  const esm = await bundle.generate({
    format: 'es',
    name: 'VeeValidate',
    banner:
    `/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
  });

  output = path.join(outputFolder, 'vee-validate.minimal.esm.js');
  fs.writeFileSync(output, esm.code);
  console.log(chalk.green('Output File:') + ' vee-validate.minimal.esm.js');
}

async function esm () {
  console.log(chalk.cyan('Generating esm builds...'));
  const bundle = await Rollup.rollup({
    input: 'src/index.js',
    plugins: [
      replace({ __VERSION__: version }),
      nodeResolve(),
      commonjs(),
      buble()
    ],
  });

  const { code } = await bundle.generate({
    format: 'es',
    name: 'VeeValidate',
    banner:
    `/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
  });

  const output = path.join(outputFolder, 'vee-validate.esm.js');
  fs.writeFileSync(output, code);
  console.log(chalk.green('Output File:') + ' vee-validate.esm.js');
}

async function build () {
  try {
    await main();
    await esm();
    await minimal();
  } catch (err) {
    console.log(chalk.red(err));
    throw err;
  }
}

build();
