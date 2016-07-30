const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        bundle: path.join(__dirname, 'docs', 'main'),
    },
    output: {
        path: path.join(__dirname, 'gh-pages', 'assets'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.woff(2)?(\?.*)?$/i,
                loader: 'url',
                query: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|svg)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('css'),
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
};
