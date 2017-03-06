const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const version = require('../package.json').version;

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/vee-validate.es2015.js',
    format: 'es',
    plugins: [
        replace({ __VERSION__: version }),
        nodeResolve(),
        commonjs()
    ],
    banner:
`/**
 * vee-validate v${version}
 * (c) ${new Date().getFullYear()} Abdelrahman Awad
 * @license MIT
 */`
};
