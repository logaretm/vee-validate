const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const version = require('../package.json').version;

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/vee-validate.js',
    format: 'umd',
    moduleName: 'VeeValidate',
    plugins: [
        replace({ __VERSION__: version }),
        nodeResolve(),
        commonjs(),
        buble(),
    ],
    banner: 
`/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
};
