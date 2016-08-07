const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        lib: path.join(__dirname, 'src'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProduction ? 'vue-validation.min.js' : 'vue-validation.js',
        library: 'VueValidation',
        libraryTarget: 'umd'
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
            }
        ]
    }
};
