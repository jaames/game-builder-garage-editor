const webpack = require('webpack');
const path = require('path');
const version = require('./package.json').version;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = function(env, argv) {

  const isProd = argv.mode && argv.mode === 'production';
  const isDev = !isProd;

  return {
    mode: isProd ? 'production' : 'development',
    entry: [
      './src/index.tsx'
    ],
    output: {
      path: `${__dirname}/dist`,
      publicPath: '/',
      filename: 'main.min.js',
    },
    resolve: {
      alias: {
        // '@core': path.resolve(__dirname, 'src/core/'),
        // '@app': path.resolve(__dirname, 'src/app/'),
        // '@components': path.resolve(__dirname, 'src/app/components/'),
        // '@store': path.resolve(__dirname, 'src/app/store/'),
        // '@styles': path.resolve(__dirname, 'src/app/styles/'),
      },
    },
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
          test: /\.s?css$/,
          use: [
            MiniCssExtract.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                }
              }
            },
            'sass-loader'
          ],
        },
        // convert SVG imports from jsx / tsx into react components
        {
          test: /\.svg$/,
          issuer: {
            and: [/\.[jt]sx?$/],
          },
          use: ['@svgr/webpack'],
        },
        // convert SVG imports from css / scss into inline URLs
        {
          test: /\.svg$/,
          issuer: {
            and: [/\.s?css$/],
          },
          type: 'asset/inline',
          generator: {
            dataUrl: content => {
              content = content.toString();
              return svgToMiniDataURI(content);
            }
          }
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
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
        __VERSION__: JSON.stringify(version),
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtract(),
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