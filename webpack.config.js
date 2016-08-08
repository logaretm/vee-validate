const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        lib: path.join(__dirname, 'src'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isProduction ? 'vee-validate.min.js' : 'vee-validate.js',
        library: 'VeeValidate',
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
