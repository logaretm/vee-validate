import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/index.js',
    format: 'umd',
    dest: 'dist/vee-validate.min.js',
    plugins: [babel(), nodeResolve(), uglify()],
    moduleName: 'VeeValidate'
};
