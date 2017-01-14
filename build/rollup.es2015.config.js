const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/vee-validate.es2015.js',
    format: 'es',
    plugins: [
        nodeResolve(),
        commonjs()
    ]
};
