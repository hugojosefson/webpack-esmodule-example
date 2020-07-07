const CommonConfig = require('./webpack.config.common.js')

const choose = variant => choices => choices[variant]
const variants = ['legacy', 'modern']

module.exports = variants.map(variant => {
  const commonConfig = CommonConfig({variant, env: 'dev'})
  return {
    ...commonConfig,
    name: variant,
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: 'public',
      port: choose(variant)({modern: 1234, legacy: 1235})
    },
    module: {
      ...commonConfig.module,
      rules: [
        ...commonConfig.module.rules,
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
      ]
    }
  }
})
