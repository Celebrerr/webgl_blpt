const path = require('path');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');

module.exports = merge(commonConfiguration, {
    stats: 'errors-warnings',
    mode: 'development',
    devServer: {
        port: 8080,
        open: true,
        hot: false,
        watchFiles: ['src/**', 'static/**'],
        static: {
            watch: true,
            directory: path.join(__dirname, '../static'),
        },
    },
});
