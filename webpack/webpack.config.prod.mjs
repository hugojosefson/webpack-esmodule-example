import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import config, { variants } from './shared.config.mjs'

export default (env, argv) =>
  variants.map(variant => {
    const mode = 'production'
    const common = config({ mode, variant })
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
          new TerserPlugin(),
        ],
      },
    }
  })
