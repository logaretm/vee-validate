const Rollup = require('rollup');
const Uglify = require('uglify-js');
const fs = require('fs');
const path = require('path');
const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const version = require('../package.json').version;

const outputFolder = path.join(__dirname, '/../', 'dist');

async function main () {
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
  fs.writeFileSync(path.join(outputFolder, 'vee-validate.min.js'), Uglify.minify(code, {
    compress: true,
    mangle: true,
  }).code);
}

async function minimal () {

}

async function esm () {
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
}

async function build () {
  try {
    await main();
    await minimal();
    await esm();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

build();
