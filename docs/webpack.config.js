const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const isProduction = process.env.NODE_ENV === 'production';

let config = {
    entry: {
        bundle: path.join(__dirname, 'src', 'main'),
    },
    output: {
        path: path.join(__dirname, '../gh-pages', 'assets'),
        filename: '[name].js'
    },
    devServer: {
        contentBase: '../gh-pages',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    babelrc: false,
                    presets: [
                      ['es2015', { modules: false }]
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style',
                    loader: 'css'
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style',
                    loader: ['css', 'sass']
                })
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
            css: ExtractTextPlugin.extract({
                fallbackLoader: 'style',
                loader: 'css'
            }),
            sass: ExtractTextPlugin.extract({
                fallbackLoader: 'style',
                loader: ['css', 'sass']
            })
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css')
    ]
};

if (isProduction) {
    config = merge(config, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                exclude: /\.vue$/,
                mangle: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                },
            })
        ]
    });
}

module.exports = config;
