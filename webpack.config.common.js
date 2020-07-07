const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const choose = variant => variants => variants[variant]

module.exports = variant => ({
  entry: choose(variant)({
    legacy: './src/variant/legacy/index.js',
    modern: './src/common/index.jsx'
  }),
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
    new ScriptExtHtmlWebpackPlugin(choose(variant)({
      legacy: {defaultAttribute: 'async'},
      modern: {module: /.*/}
    })),
  ],
  module: {
    rules: [
      {
        test: /\.(m?js|jsx)$/,
        // exclude: /[\\/]node_modules[\\/]/, // babel all the things!
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-solid',
              ['@babel/preset-env', {
                browserslistEnv: variant,
                bugfixes: true,
                ...(choose(variant)({
                  legacy: {
                    corejs: 3,
                    useBuiltIns: 'entry'
                  },
                  modern: {
                    corejs: false,
                    useBuiltIns: false
                  }
                }))
              }]
            ],
          }

        },
      },
    ]
  }
})
