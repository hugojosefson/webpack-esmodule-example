const {default: config, choose, variants} = require('./shared.config.js')

module.exports = variants.map(variant => {
  const mode = 'development'
  const common = config({mode, variant})
  return {
    mode,
    name: variant,
    devtool: 'inline-source-map',
    devServer: {
      contentBase: 'public',
      port: choose(variant)({modern: 1234, legacy: 1235})
    },
    entry: common.entry,
    output: common.output,
    module: {
      rules: [
        common.babelRule,
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      ...common.htmlPlugins,
    ],
  }
})
