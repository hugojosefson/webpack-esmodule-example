const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const VALID_VARIANTS = ['legacy', 'modern']
const variant = process.env.BROWSERSLIST_ENV
if (!VALID_VARIANTS.includes(variant)) {
  throw new Error(`BROWSERSLIST_ENV must be one of ${VALID_VARIANTS.map(JSON.stringify).join(', ')}.`)
}
const isLegacy = variant === 'legacy'

module.exports = {
  entry: isLegacy ? './src/variant/legacy/index.js' : './src/common/index.jsx',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, `target/prod/${variant}`)
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.resolve(__dirname, 'src', 'variant', variant, 'prod', 'index.html'),
    }),
    new ScriptExtHtmlWebpackPlugin(isLegacy ? {
      defaultAttribute: 'async'
    } : {
      module: /.*/
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(m?js|jsx)$/,
        // exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  }
}
