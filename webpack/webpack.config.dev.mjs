import config, { choose, variants } from './shared.config.mjs'

export default (env, argv) =>
  variants.map(variant => {
    const mode = 'development'
    const common = config({ env, mode, variant })
    return {
      mode,
      name: variant,
      devtool: 'inline-source-map',
      devServer: {
        static: { publicPath: 'public' },
        port: choose(variant)({ modern: 1234, legacy: 1235 }),
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
      plugins: [...common.htmlPlugins],
    }
  })
