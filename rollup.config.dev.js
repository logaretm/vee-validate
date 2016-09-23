import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    format: 'umd',
    dest: 'dist/vee-validate.js',
    plugins: [babel(), nodeResolve()],
    moduleName: 'VeeValidate'
};
