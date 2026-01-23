const CopyPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: "./src/Main.js",
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "assets"), to: 'assets/'},
                { from: path.resolve(__dirname, "static/main.css"), to: 'main.css'},
            ],
        }),
        new HTMLWebpackPlugin({
            template: 'static/index.html',
            filename: 'index.html',
            hash: true
        }),
        new webpack.DefinePlugin({
            DEBUG: false
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
    },
    optimization: {
        minimizer: [ new CssMinimizerPlugin() ]
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    }
}
