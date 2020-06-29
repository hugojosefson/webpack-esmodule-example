module.exports = {
  presets: [
    'babel-preset-solid',
    ['@babel/preset-env', {
      browserslistEnv: process.env.BROWSERSLIST_ENV,
      bugfixes: true,
      corejs: 3,
      useBuiltIns: 'entry'
    }]
  ],
}
