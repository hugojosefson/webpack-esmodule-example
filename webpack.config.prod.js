const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CommonConfig = require('./webpack.config.common.js')

const variants = ['legacy', 'modern']

module.exports = variants.map(variant => {
  const commonConfig = CommonConfig({variant, env: 'prod'})
  return {
    ...commonConfig,
    name: variant,
    mode: 'production',
    devtool: 'source-map',
    module: {
      ...commonConfig.module,
      rules: [
        ...commonConfig.module.rules,
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      ...commonConfig.plugins,
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
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: true,
        }),
      ],
    },
  }
})
