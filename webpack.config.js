const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const cssLoaders = (extra) => {
    let loaders = [
        {
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: isDev
        }
        }, 
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist:['ie >= 8', 'last 4 version']
                    })
                ],
                sourceMap: true
            }
        }
    ]

    if (extra){
        loaders.push(extra);
    }
    
    return loaders;
}

const optimization = () => {
    let opt = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd){
        opt.minimizer = [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin()
        ]
    }

    return opt
}

const jsLoader = (preset) => {
    let loader = {
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
        }
    }

    if (preset){
        loader.options.presets.push(preset);
    }

    return loader;
}

module.exports = {
    entry: {
        'main': ['@babel/polyfill', '@src/index.ts'],
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: jsLoader()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: jsLoader('@babel/preset-typescript')
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: jsLoader('@babel/preset-react')
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.csv$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['file-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: isProd ? '[name].[hash].css' : '[name].css'
        }),
    ],
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    resolve: {
        extensions: ['.js', '.json', '.ts'],
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@styles': path.resolve(__dirname, 'src/assets/styles'),
            '@data': path.resolve(__dirname, 'src/data'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
            '@js': path.resolve(__dirname, 'src/assets/js'),
            '@comp': path.resolve(__dirname, 'src/components'),
            '@tests': path.resolve(__dirname, 'src/tests')
        }
    },
    optimization: optimization(),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProd ? '[name].[hash].js' : '[name].js'
    },
}