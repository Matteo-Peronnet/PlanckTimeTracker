const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

new webpack.EnvironmentPlugin({
    NODE_ENV: 'dev',
    ...dotenv.config().parsed // <-- this line
}),

module.exports = {
    externals: nodeModules,
    entry: [
        './src/index.js'
    ],
    target: 'node',
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react','es2015','stage-0'],
                    plugins: [
                        "transform-decorators-legacy", "transform-decorators",
                        "transform-class-properties",
                        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] // `style: true` for less
                    ]
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader'
            },
            // YAML
            {
                test: /\.yaml$/,
                use: [{ loader: 'json-loader' }, { loader: 'yaml-loader' }],
            },
        ],
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        port: 4172
    }
};
