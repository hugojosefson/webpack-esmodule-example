const CommonConfig = require('./webpack.config.common.js')

const variants = ['legacy', 'modern']

module.exports = variants.map(variant => {
  const commonConfig = CommonConfig(variant)
  return {
    ...commonConfig,
    name: variant,
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
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
