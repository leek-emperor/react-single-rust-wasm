const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin'); // 赋予 webpack 处理 wasm 能力的插件
/**
 * @type import('webpack').Configuration
 */
module.exports = {
    entry: path.resolve(__dirname, '../web/index.tsx'),
    devServer: {
        port: '3042',
        publicPath: '/', // 基础路径
        progress: true, //打包进度条
        open: true, //打包完成自动打开浏览器
        compress: false, //启用压缩
        hot: true, // 开启热更新
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../web/index.html'), //需要放打包文件的html模板路径
            filename: 'index.html', //打包完成后的这个模板叫什么名字
        }),
        new WasmPackPlugin({
            // 这里是crate的路径，这是根目录，所以要上去一层，其实不上一层也找得到（不知道为什么），但是改动rust将不会触发热更新
            crateDirectory: path.resolve(__dirname, '..'),
            outDir: path.resolve(__dirname, '../web/rwasm'), // 输出文件夹路径，默认是'pkg'
            outName: 'index', // 默认文件以index开头
        }),
        // Have this example work in Edge which doesn't ship `TextEncoder` or
        // `TextDecoder` at this time. 处理浏览器兼容问题
        new webpack.ProvidePlugin({
            TextDecoder: ['text-encoding', 'TextDecoder'],
            TextEncoder: ['text-encoding', 'TextEncoder'],
        }),
    ],
    mode: 'development',
    experiments: {
        asyncWebAssembly: true, // 打开异步 WASM 功能
    },
};
