const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const pkg = require('./package.json')

const choose = variant => choices => choices[variant]
const variants = ['legacy', 'modern']

const htmlOptions = filename => ({
  filename,
  inject: 'head',
  title: pkg.title || `${pkg.name}: ${pkg.description}`,
  favicon: 'public/favicon.ico',
  meta: {
    viewport: 'width=device-width, user-scalable=yes, initial-scale=1.0',
    'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
  },
})

module.exports = {
  choose,
  variants,
  default: ({ mode, variant }) => ({
    entry: choose(variant)({
      modern: './src/index.jsx',
      legacy: './src/index-legacy.jsx',
    }),
    output: {
      filename: `${variant}.[name].[contenthash].js`,
      path: path.resolve(__dirname, `target/${mode}`),
    },
    htmlPlugins: [
      choose(mode)({
        development: new HtmlWebpackPlugin(htmlOptions(`index.html`)),
        production: new HtmlWebpackPlugin(htmlOptions(`index-${variant}.html`)),
      }),
      new ScriptExtHtmlWebpackPlugin(
        choose(variant)({
          modern: { module: /.*/ },
          legacy: {
            defaultAttribute: 'async',
            custom: [{ test: /.*/, attribute: 'nomodule' }],
          },
        })
      ),
    ],
    babelRule: {
      test: /\.(m?js|jsx)$/,
      // exclude: /[\\/]node_modules[\\/]/, // babel all the things!
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            'babel-preset-solid',
            [
              '@babel/preset-env',
              {
                browserslistEnv: variant,
                bugfixes: true,
                ...choose(variant)({
                  modern: {
                    corejs: false,
                    useBuiltIns: false,
                  },
                  legacy: {
                    corejs: 3,
                    useBuiltIns: 'entry',
                  },
                }),
              },
            ],
          ],
        },
      },
    },
  }),
}
