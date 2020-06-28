module.exports = {
  presets: [
    ['@babel/preset-env', {
      browserslistEnv: process.env.BROWSERSLIST_ENV,
      bugfixes: true,
      corejs: 3,
      useBuiltIns: 'entry'
    }]
  ],
}
