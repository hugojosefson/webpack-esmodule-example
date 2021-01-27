/**
 * Wrapper hack until webpack properly supports config as ES Module.
 * Delete this file, and point any references to the .mjs file after
 * https://github.com/webpack/webpack-cli/issues/1622 is closed.
 */
module.exports = async (env, argv) => {
  const config = await import('./webpack.config.dev.mjs')
  return config.default(env, argv)
}
