const path = require('path');
const merge = require('webpack-merge');
const poststylus = require('poststylus');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


// eslint-disable-next-line
const page = (name) => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: `src/templates/${name}.pug`,
    filename: `../${name}.html`
  });
};

const isProduction = process.env.NODE_ENV === 'production';

let config = {
  entry: {
    bundle: path.join(__dirname, '/../', 'src/js/main'),
    vendor: ['vue', 'vee-validate']
  },
  output: {
    path: path.join(__dirname, '/../', 'assets'),
    filename: 'js/[name]-[hash].js',
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      stylus: {
        use: [poststylus(['autoprefixer'])]
      }
    }),
    page('index'),
    page('api'),
    page('examples'),
    page('rules'),
    page('localization'),
    page('advanced'),
    new FriendlyErrorsWebpackPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|locale)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }],
              ],
              plugins: [
                'transform-object-rest-spread',
                'syntax-dynamic-import'
              ]
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.woff(2)?(\?.*)?$/i,
        loader: 'url-loader',
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
      },
      {
        test: /.pug$/,
        exclude: /node_modules/,
        loader: 'pug-loader'
      }
    ]
  }
};

config = merge(
  config,
  isProduction ? require('./webpack.config.prod.js') : require('./webpack.config.dev.js')
);

module.exports = config;
