const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const target = process.env.TARGET || 'web'
const isProd = env === 'production'
const fileNamePatt = '[name].[contenthash:7]'

const path = require('path')
function resolvePath(dir) {
  return path.resolve(__dirname, '..', dir)
}

function createStylesLoader(test, ownLoader) {
  const loaders = []

  if (isProd) {
    loaders.push({
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../', // static/css --> ../../,
      },
    })
  } else {
    loaders.push({
      loader: 'style-loader',
    })
  }

  loaders.push({
    loader: 'css-loader',
    options: {
      sourceMap: isProd,
    },
  })

  loaders.push({
    loader: 'postcss-loader',
    options: {
      sourceMap: isProd,
    },
  })

  if (ownLoader) {
    loaders.push(ownLoader)
  }

  return {
    test,
    use: loaders,
  }
}


/**
 * Full configuration
 * https://webpack.js.org/configuration/
 */
const webpackConfig = {
  mode: env,

  entry: {
    app: './src/app.js',
  },

  output: {
    path: resolvePath('dist'),
    publicPath: 'auto',
    filename: `js/${fileNamePatt}.js`,
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      src: resolvePath('src'),
    },
  },

  // https://juejin.cn/post/6844904201311485966
  devtool: false,

  optimization: {
    // moduleIds: 'natural',
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        extractComments: {
          // Precisely extract vendor licenses
          condition: /^\**!|LICENSE|@preserve|@cc_on/i,
        },
      }),
      new CssMinimizerPlugin({
        // https://lightningcss.dev/docs.html#with-webpack
        // minify: CssMinimizerPlugin.lightningCssMinify,
        // https://cssnano.co/docs/what-are-optimisations/
        // minify: CssMinimizerPlugin.cssnanoMinify,
        minimizerOptions:
        // cssnano
          {
            preset: [
              'default',
              {
                // Keep license related comments (todo: move license comment to separate file)
                discardComments: {
                  remove: (comment) => {
                    const patt = /^\**!|LICENSE|@preserve|@cc_on/i // must in the scope
                    return !comment.match(patt)
                  },
                },
                discardUnused: true,
              },
            ],
          },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        defaultVendors: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          // chunks: 'initial',
          priority: -20,
        },
        // Specific library for iOS file formats
        vendorsHeic: {
          test: /[\\/]node_modules[\\/]heic2any[\\/]/,
          name: 'vendors-heic',
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      // styles
      createStylesLoader(/\.css$/i),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(env),
      TARGET: JSON.stringify(target),
    }),

    // Vendor plugins (must be before webpack plugins)
    new VueLoaderPlugin(),

    // Ignore all locale files of moment.js
    // https://webpack.js.org/plugins/ignore-plugin/#root
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),

    ...(isProd
      ? [
        new MiniCssExtractPlugin({
          filename: `css/${fileNamePatt}.css`,
        }),
      ]
      : [
        // Development only plugins
        // new webpack.HotModuleReplacementPlugin(), // no need since webpack-dev-server 4.0
      ]),

    new HtmlWebpackPlugin({
      title: require('../package.json').name,
      template: './src/index.html',
      filename: './index.html',
      inject: true,
      minify: isProd
        ? {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        }
        : false,
    }),
  ],
}

module.exports = webpackConfig



