const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [];

if (isProduction) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false
            }
        })
    );
}

module.exports = {
    entry: path.join(__dirname, 'src/index'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: `vee-validate.${isProduction ? 'min.' : ''}js`,
        library: 'VeeValidate',
        libraryTarget: 'umd'
    },
    plugins,
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    babelrc: false,
                    presets: [
                        ['es2015', { modules: false }]
                    ],
                    plugins: ['transform-object-assign']
                }
            },
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre'
            }
        ]
    }
};
