const browserslistEnv = process.env.BROWSERSLIST_ENV
const isLegacy = browserslistEnv === 'legacy'

module.exports = {
  presets: [
    'babel-preset-solid',
    ['@babel/preset-env', {
      browserslistEnv,
      bugfixes: true,
      ...(isLegacy ? {
        corejs: 3,
        useBuiltIns: 'usage'
      } : {
        corejs: false,
        useBuiltIns: false
      })
    }]
  ],
}
