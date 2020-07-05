const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const browserslistEnv = process.env.BROWSERSLIST_ENV
const isLegacy = browserslistEnv === 'legacy'

module.exports = {
  entry: isLegacy ? './src/variant/legacy/index.js' : './src/common/index.jsx',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.resolve(__dirname, 'src', 'variant', isLegacy ? 'legacy' : 'modern', 'prod', 'index.html'),
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
