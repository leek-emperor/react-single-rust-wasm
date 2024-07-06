const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin'); // 赋予 webpack 处理 wasm 能力的插件
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        filename: '[name].[contenthash].js',
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../web/index.html'), //需要放打包文件的html模板路径
            filename: 'index.html', //打包完成后的这个模板叫什么名字
        }),
        new WasmPackPlugin({
            // 这里是crate的路径，这是根目录，所以要上去一层，其实不上一层也找得到（不知道为什么），但是改动rust将不会触发热更新
            crateDirectory: path.resolve(__dirname, '..'),
            outDir: path.resolve(__dirname, '../web/rwasm'), // 输出文件夹路径，默认是'pkg'
            outName: 'index', // 默认文件以index开头
            extraArgs: '--target web',
        }),
        // Have this example work in Edge which doesn't ship `TextEncoder` or
        // `TextDecoder` at this time. 处理浏览器兼容问题
        new webpack.ProvidePlugin({
            TextDecoder: ['text-encoding', 'TextDecoder'],
            TextEncoder: ['text-encoding', 'TextEncoder'],
        }),
        new BundleAnalyzerPlugin(),
        new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
            threshold: 1024, //文件大小大于这个值时启用压缩
            deleteOriginalAssets: false, //压缩后保留原文件
        }),
    ],
    optimization: {
        splitChunks: {
            maxInitialRequests: Infinity, // 无限大。入口的最大并行请求数，默认3
            minSize: 0, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来。默认值是30kb
            chunks: 'all',
            minSize: 30,
            cacheGroups: {
                // 拆分第三方库
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    // name(module) {
                    //     const packageName = module.context.match(
                    //         /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                    //     )[1]; // 获取第三方包名
                    //     return `npm.${packageName.replace('@', '')}`; // npm 软件包名称是 URL 安全的，但是某些服务器不喜欢@符号
                    // },
                    name: 'vendor.[contenthash].js',
                    priority: 10, // 优先级，用来判断打包到哪个里面去。数字越大表示优先级越高
                },
                // react: {
                //     test: /[\\/]node_modules[\\/]_?react/,
                //     name: 'react-chunk',
                //     priority: 12,
                // },
                // reactDom: {
                //     test: /[\\/]node_modules[\\/]_?react-dom/,
                //     name: 'react-dom-chunk',
                //     priority: 13,
                // },
            },
        },
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    mode: 'development',
    experiments: {
        asyncWebAssembly: true, // 打开异步 WASM 功能
    },
};
