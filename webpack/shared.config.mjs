import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import Config from '../generate-config/config.mjs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const choose = variant => choices => choices[variant]
export const variants = ['legacy', 'modern']

const htmlOptions = ({ env, filename }) => ({
  filename,
  template: path.resolve(__dirname, '../src/index.ejs'),
  templateParameters: (compilation, assets, assetTags, options) => ({
    title: options.title,
    configFromEnv: env ? Config(env) : undefined,
  }),
  inject: 'head',
  title: pkg.title || `${pkg.name}: ${pkg.description}`,
  favicon: path.resolve(__dirname, '../public/favicon.ico'),
  meta: {
    viewport: 'width=device-width, user-scalable=yes, initial-scale=1.0',
    'X-UA-Compatible': { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
  },
})

export default ({ env, mode, variant }) => ({
  entry: choose(variant)({
    modern: path.resolve(__dirname, '../src/index.jsx'),
    legacy: path.resolve(__dirname, '../src/index-legacy.jsx'),
  }),
  output: {
    filename: `${variant}.[name].[contenthash].js`,
    path: path.resolve(__dirname, `../target/${mode}`),
  },
  htmlPlugins: [
    choose(mode)({
      development: new HtmlWebpackPlugin(
        htmlOptions({ env, filename: `index.html` })
      ),
      production: new HtmlWebpackPlugin(
        htmlOptions({ filename: `index-${variant}.html` })
      ),
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
})
