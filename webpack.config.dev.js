const commonConfig = require('./webpack.config.common.js')

module.exports = {
  ...commonConfig,
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
