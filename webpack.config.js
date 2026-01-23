const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: "./src/Main.js",
    devServer: {
        static: "./build",
        compress: true,
        port: 9000
    },
    devtool: 'inline-source-map',
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "assets"), to: 'assets/'},
                { from: path.resolve(__dirname, "static/main.css"), to: './'},
            ],
        }),
        new HTMLWebpackPlugin({
            template: 'static/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            DEBUG: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    },
    resolve: {
        fallback: {
            fs: false
        }
    }
}
