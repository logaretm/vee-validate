const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/vee-validate.js',
  format: 'umd',
  moduleName: 'VeeValidate',
  plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      buble()
  ]
};
