const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
import { Configuration } from 'webpack';
import * as webpackDevServer from 'webpack-dev-server'; // Для девсервера в конфиге

const config: Configuration = {
    // entry: ['react-hot-loader/patch', './src/index.tsx'],
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            /* {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }, */
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]__[sha1:hash:hex:7]',
                            },
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
        preferAbsolute: true,
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {},
    },
    devServer: {
        port: 5000,
        https: true,
        onAfterSetupMiddleware: function (devServer: any) {
            devServer.app.post('*', (req: any, res: any) => {
                res.redirect(req.originalUrl);
            });
        },
        static: {
            directory: './dist',
        },
    },
};

module.exports = config;
