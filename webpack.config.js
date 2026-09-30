/* global __dirname, require, module */

// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const path = require('path');
const { env } = require('yargs').argv;
const pkg = require('./package.json');

const libraryName = pkg.name;

let outputFile; let
  mode;

if (env === 'build') {
  mode = 'production';
  outputFile = `${libraryName}.min.js`;
} else {
  mode = 'development';
  outputFile = `${libraryName}.js`;
}

const config = {
  mode,
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/dist`,
    filename: outputFile,
    library: 'listen1Api',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      // 1. 转译你自己的源码
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      // 2. 新增：强制转译 cheerio，解决 export * as 语法报错
      {
        test: /\.m?js$/,
        include: /node_modules[\\/]cheerio/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // 3. 修正 eslint-loader（原来 exclude 写反了）
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        include: /src/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  externals: {
    request: 'request',
    electron: 'electron',
  },
};

module.exports = config;
