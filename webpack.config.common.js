const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const choose = variant => choices => choices[variant]

module.exports = ({variant, env}) => ({
  entry: `./src/variant/${variant}/index.jsx`,
  output: {
    filename: `${variant}.[name].[contenthash].js`,
    path: path.resolve(__dirname, `target/${env}`)
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index-${variant}.html`,
      inject: 'head',
      title: 'parcel-esmodule-example',
      favicon: 'public/favicon.ico',
      meta: {
        viewport: 'width=device-width, user-scalable=yes, initial-scale=1.0',
        'X-UA-Compatible': {'http-equiv': 'X-UA-Compatible', content: 'ie=edge'}
      }
    }),
    new ScriptExtHtmlWebpackPlugin(choose(variant)({
      legacy: {
        defaultAttribute: 'async',
        custom: [
          {
            test: /.*/,
            attribute: 'nomodule',
          }
        ]
      },
      modern: {module: /.*/},
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
