const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {default: config, variants} = require('./shared.config.js')

module.exports = variants.map(variant => {
  const mode = 'production'
  const common = config({mode, variant})
  return {
    mode,
    name: variant,
    devtool: 'source-map',
    entry: common.entry,
    output: common.output,
    module: {
      rules: [
        common.babelRule,
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      ...common.htmlPlugins,
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    optimization: {
      minimizer: [
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
        new TerserPlugin({
          parallel: true,
          cache: true,
          sourceMap: true,
        }),
      ],
    },
  }
})
