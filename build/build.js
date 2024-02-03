const webpack = require('webpack')
const config = require('./webpack.config.js')

webpack(config, (err, stats) => {
  if (err) throw err

  console.info(
    stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false,
    }),
    '\n',
  )

  if (stats.hasErrors()) {
    process.exit(1)
  }
})
