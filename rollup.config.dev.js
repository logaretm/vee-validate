import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/index.js',
    format: 'umd',
    dest: 'dist/vee-validate.js',
    plugins: [
        babel({
            babelrc: false,
            presets: [
                ['es2015', { modules: false }]
            ],
            plugins: ['external-helpers', 'transform-object-assign']
        }),
        nodeResolve(),
        commonjs()
    ],
    moduleName: 'VeeValidate'
};
