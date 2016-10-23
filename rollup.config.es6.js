import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'src/index.js',
    format: 'es',
    dest: 'dist/vee-validate.es6.js',
    plugins: [nodeResolve()],
    moduleName: 'VeeValidate'
};
