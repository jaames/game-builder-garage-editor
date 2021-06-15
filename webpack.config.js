const webpack = require('webpack');
const path = require('path');
const version = require('./package.json').version;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

module.exports = function(env, argv) {

  const isProd = argv.mode && argv.mode === 'production';
  const isDev = !isProd;

  return {
    mode: isProd ? 'production' : 'development',
    entry: [
      './src/index.tsx'
    ],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                getCustomTransformers: () => ({
                  before: isDev ? [ReactRefreshTypeScript()] : [],
                }),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtract.loader, 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
      path: `${__dirname}/dist`,
      publicPath: '/',
      filename: 'app.min.js',
    },
    plugins: [
      isProd && new webpack.BannerPlugin({
        banner: [
          `/*!!`,
          ` * GBG Save Editor 👀 v${ version } (hash:[fullhash])`,
          ` * Game viewer + data editor for Game Builder Garage save files`,
          ` * 2021 James Daniel (github.com/jaames)`,
          ` * Game Builder Garage is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way`,
          ` */`
        ].join('\n'),
        raw: true,
      }),
      new webpack.DefinePlugin({
        __DEV__: isDev,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      isDev && new webpack.HotModuleReplacementPlugin(),
      isDev && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: function (node, comment) {
              if (comment.type == "comment2")
                return comment.value.startsWith('!!');
            },
          },
        }
      })],
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      liveReload: true,
      hot: true,
      port: 9000,
      historyApiFallback: true,
      // writeToDisk: true,
    },
  };
}