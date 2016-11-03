import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/index.js',
    format: 'es',
    dest: 'dist/vee-validate.es6.js',
    plugins: [nodeResolve(), commonjs()],
    moduleName: 'VeeValidate'
};
