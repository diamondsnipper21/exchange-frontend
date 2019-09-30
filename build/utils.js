var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var createSassExtractJsPlugin = require('sass-extract-js/lib/plugin')
var rgbHex = require('rgb-hex');

function isBase64(v, opts) {
  if (v instanceof Boolean || typeof v === 'boolean') {
    return false
  }
  if (!(opts instanceof Object)) {
    opts = {}
  }
  if (opts.hasOwnProperty('allowBlank') && !opts.allowBlank && v === '') {
    return false
  }

  var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';

  if (opts.mime) {
    regex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)?' + regex
  }

  if (opts.paddingRequired === false) {
    regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
  }

  return (new RegExp('^' + regex + '$', 'gi')).test(v);
}

/**
 * Fetches color scheme (dark/light) from project's theme.
 */
exports.fetchThemeColorScheme = function () {
  var themeVars = {}
  var themeName = 'cce'
  var themeColorSchemePath = `./src/assets/sass/themes/${themeName.toLowerCase()}/color-scheme.scss`
  var themeColorSchemeAbsolutePath = path.resolve(path.join(process.cwd(), themeColorSchemePath));

  try {
    var sassExtractJsPlugin = createSassExtractJsPlugin({camelCase: true})
    var sassExtract = require('sass-extract')
    var rendered = sassExtract.renderSync({
      file: themeColorSchemeAbsolutePath,
    }, {
      plugins: [sassExtractJsPlugin],
    })
    themeVars = rendered.vars

    // sass-extract-js converts all colors to rgb() format
    // and tradeview chart's options.toolbar_bg fails with rgb().
    // Convert colors back to hex for now.
    // @TODO find better solution to fix issue described above;
    // Object.keys(themeVars).forEach(function(key) {
    Array.from(['darkChartToolbarBg', 'lightChartToolbarBg']).forEach(function(key) {
      var value = rendered.vars[key];
      if (typeof value !== 'string') {
        return;
      }
      if (value.substring(0, 3) !== 'rgb') {
        return;
      }
      themeVars[key] = '#' + rgbHex(value);
    })
  } catch (e) {
    console.error('Error', e)
  }

  return themeVars
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader, postcssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    if (loader === 'sass' || loader === 'scss') {
      var themeName = 'cce'
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          resources: [
            `./src/assets/sass/themes/${themeName}/color-scheme.scss`,
            `./src/assets/sass/mixins.scss`,
          ],
        }});
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }
  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    // second is
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true,
      data: `@import "@/assets/sass/base.scss";`,
    }),
    // custom import url will have to appear here
    scss: generateLoaders('sass', {
    }),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
