import R from 'ramda'
import { resolve } from 'path'
import makeRule from 'webpack-make-rule'
import webpack from 'webpack'
import ProgressBar from 'progress-bar-webpack-plugin'
import Dashboard from 'webpack-dashboard/plugin'

export { makeRule }

export const base = {
  module: {
    rules: []
  },
  resolve: {
    alias: {}
  },
  externals: {},
  output: {},
  plugins: []
}

export const addSourcemap = R.assoc('devtool', 'sourcemap')

export const addRule = rule => R.evolve({
  module: {
    rules: R.append(rule)
  }
})

// https://webpack.js.org/configuration/plugins/#plugins
export const addPlugin = plugin => R.evolve({
  plugins: R.append(plugin)
})

export const addOutput = R.curry((key, val) => R.assocPath(['output', key], val))

export const addProgress = addPlugin(new ProgressBar())
export const addDashboard = addPlugin(new Dashboard())

export const addBabel = addRule(
  makeRule(/\.jsx?$/, 'babel-loader')
)

export const addProduction = addPlugin(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': 'production'
  })
)

// https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
export const addMinify = R.pipe(
  addPlugin(new webpack.optimize.UglifyJsPlugin()),
  addPlugin(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname
      }
    })
  ),
  R.evolve({
    output: {
      filename: R.replace('.js', '.min.js')
    }
  })
)

export const addAlias = (from, to) => R.evolve({
  resolve: {
    alias: R.assoc(from, to)
  }
})

export const addName = (() => {
  const capitalize = str => {
    const [head, ...tail] = str
    return [head.toUpperCase(), ...tail].join('')
  }

  const dashesToConstructorCase = R.pipe(
    R.split('-'),
    R.map(capitalize),
    R.join('')
  )

  return name => R.pipe(
    addOutput('filename', `${name}.js`),
    addOutput('library', dashesToConstructorCase(name))
  )
})()

export const addGlobal = name => R.assocPath(['externals', name], name)

export const addExtern = (name, umdName) => R.assocPath(
  ['externals', name],
  {
    'root': umdName || name,
    'commonjs2': name,
    'commonjs': name,
    'amd': name
  }
)

export const addUMD = R.pipe(
  addOutput('libraryTarget', 'umd'),
  addOutput('path', resolve(process.cwd(), 'umd'))
)

export const addCJS2 = R.pipe(
  addOutput('libraryTarget', 'commonjs2'),
  addOutput('path', resolve(process.cwd(), 'lib'))
)

