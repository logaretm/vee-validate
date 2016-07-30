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
