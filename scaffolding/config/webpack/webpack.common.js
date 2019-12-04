const tsConfig = require('../../tsconfig');


const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const projectRoot = process.cwd();
const appDir = path.resolve(process.cwd(), './app');


/**
 * Our basic development configuration. Nothing here depends on environment variables. Sets the following:
 * - context
 * - entry
 * - output
 * - devtool
 * - resolve.aliases
 * - resolve.extensions
 * - universal plugins (HTMLWebpack)
 */
const config = {

    context: path.resolve(appDir, './src'),

    entry: {
        app: [
            'react-hot-loader/patch',
            './index.tsx',
        ],
    },

    output: {
        path: path.resolve(appDir, './dist'),
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    resolve: {

        alias: {
            App: path.resolve(projectRoot, 'app/src/'),
            Assets: path.resolve(projectRoot, 'app/src/assets/'),
            Scenes: path.resolve(projectRoot, 'app/src/scenes/'),
            Services: path.resolve(projectRoot, 'app/src/services/'),
            Components: path.resolve(projectRoot, 'components/'),
            Tools: path.resolve(projectRoot, 'components/_tools/'),
            Base: path.resolve(projectRoot, 'components/_base/'),
            Config: path.resolve(projectRoot, 'app/src/config/'),
            "@app": path.resolve(projectRoot, 'app/src/'),
            "@assets": path.resolve(projectRoot, 'app/src/assets/'),
            "@scenes": path.resolve(projectRoot, 'app/src/scenes/'),
            "@services": path.resolve(projectRoot, 'app/src/services/'),
            "@components": path.resolve(projectRoot, 'components/'),
            "@tools": path.resolve(projectRoot, 'components/_tools/'),
            "@base": path.resolve(projectRoot, 'components/_base/'),
            "@config": path.resolve(projectRoot, 'app/src/config/'),
            "@utilities": path.resolve(projectRoot, 'app/src/utilities/'),
        },

        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],

    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: 'body',
        }),
    ],

};


/**
 * Our actual export, along with configuration dependant on environment and/or other variables
 */
module.exports = (env, props) => {


    /** the native path(s) that should be cleaned */
    const pathsToClean = [
        path.join(process.cwd(), 'native/www/**/*'),
    ];


    /** the clean options to use */
    const cleanOptions = {
        root: env.native ? path.resolve(appDir, '../') : appDir,
        cleanOnceBeforeBuildPatterns: env.native ? pathsToClean : undefined,
        verbose:  false,
        dry:      false,
    };


    config.module = {
        rules: [
            {
                test: /\.([tj])sx?$/,
                exclude: /node_modules\/(?!(@?brewkit)\/).*/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                ["@babel/env", {
                                    "modules": "cjs",
                                }],
                                "@babel/react",
                                "@babel/typescript"
                            ],
                            "plugins": [
                                "react-hot-loader/babel",
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread",
                                "@babel/plugin-transform-object-assign",
                                "@babel/plugin-syntax-dynamic-import",
                            ]
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader', //  interprets @import and url() like import/require() and will resolve them.
                    },
                    {
                        loader: 'css-loader', //  interprets @import and url() like import/require() and will resolve them.
                        options: {
                            modules: {
                                localIdentName: "[local]_[hash:base64]",
                            },
                            importLoaders: 2,
                            sourceMap: false,
                        }
                    },
                    {
                        loader: 'postcss-loader', // postcss loader so we can use autoprefixer
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        grid: true,
                                    })
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader', // compiles Sass to CSS
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: '@brewkit/loader',
                    }
                ],
            },

            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|eot)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    outputPath: 'assets',
                }
            },

        ],
    };


    console.log('\x1b[35m' + '┏━━━━━━━━━━ Building ━━━━━━━━━━┓');


    /**
     * Development only configuration. Does the following:
     * - Sets devServer
     * - Adds source-mapping
     * - Adds additional plugins
     */
    if (env.development) {

        console.log('\x1b[35m' + '┣━ using dev APIs...           ┫');

        config.devServer = {
            contentBase: '/src',
                hot: true,
                historyApiFallback: true,
        };

        config.devtool = 'inline-cheap-module-source-map';

        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /a\.js|node_modules/,
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({
                "API_URL": JSON.stringify("https://api.dev.ovrc.com:5443")
            }),
        );

    }


    /**
     * Non-development options. Differs in the following:
     * - Changes entry
     * - Adds minimization
     * - Changes devtool
     * - Adds additional plugins
     */
    else {

        config.entry = {
            app: ['./index.js'],
        };

        config.optimization = {
            minimizer: [new TerserPlugin()],
        };

        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
                chunkFilename: '[id].[hash].css',
            }),
            new CleanWebpackPlugin(cleanOptions),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        );


        /**
         * QA options. In addition to non-development, does the following:
         * - Defines API_URL variable
         */
        if (env.qa) {

            console.log('\x1b[35m' + '┣━ using QA APIs...            ┫');

            config.plugins.push(
                new webpack.DefinePlugin({
                    "API_URL": JSON.stringify("https://api.qa.ovrc.com:5443"),
                }),
            );

        }


        /**
         * Staging options. In addition to non-development, does the following:
         * - Defines API_URL variable
         */
        if (env.staging) {

            console.log('\x1b[35m' + '┣━ using staging APIs...       ┫');

            config.plugins.push(
                new webpack.DefinePlugin({
                    "API_URL": JSON.stringify("https://api.staging.ovrc.com"),
                }),
            );

        }


        /**
         * Production options. In addition to non-development, does the following:
         * - Defines API_URL variable
         */
        if (env.production) {

            console.log('\x1b[35m' + '┣━ using production APIs...    ┫');

            config.plugins.push(
                new webpack.DefinePlugin({
                    "API_URL": JSON.stringify("https://api.beta.ovrc.com"),
                }),
            );

        }

    }

    /**
     * Native options. In addition to non-development, does the following:
     * - Changes output path
     * - Defines API_URL variable
     */
    if (props.native) {

        config.output.path = path.resolve(appDir, '../native/www');
        delete config.output.publicPath;

        console.log('\x1b[35m' + '┣━ generating native build...  ┫');

    }


    console.log('\x1b[35m' + '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');


    return config;
};
