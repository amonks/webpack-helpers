import R from 'ramda'

import * as fns from '../../'

export const addSourcemap = {
  fn: fns.addSourcemap,
  result: {devtool: 'sourcemap'}
}

export const addRule = v => ({
  fn: fns.addRule(v),
  result: {
    module: {
      rules: R.contains(v)
    }
  }
})

export const addPlugin = v => ({
  fn: fns.addPlugin(v),
  result: {
    plugins: R.contains(v)
  }
})

export const addOutput = (v1, v2) => ({
  fn: fns.addOutput(v1, v2),
  result: {
    output: {
      [v1]: v2
    }
  }
})

export const addMinJs = v => ({
  fn: fns.addMinJs,
  input: {
    output: {
      filename: `${v}.js`
    }
  },
  result: {
    output: {
      filename: R.equals(`${v}.min.js`)
    }
  }
})

export const addAlias = (v1, v2) => ({
  fn: fns.addAlias(v1, v2),
  result: {
    resolve: {
      alias: R.propEq(v1, v2)
    }
  }
})

export const addName = v => ({
  fn: fns.addName(v),
  result: {
    output: {
      filename: `${v}.js`,
      library: R.is(String)
    }
  }
})

export const capitalizeName = {
  fn: fns.addName('name-with-dashes'),
  result: {
    output: {
      filename: 'name-with-dashes.js',
      library: 'NameWithDashes'
    }
  }
}

export const addGlobal = v => ({
  fn: fns.addGlobal(v),
  result: {
    externals: {
      [v]: v
    }
  }
})

export const addExternWithoutUMDName = v => ({
  fn: fns.addExtern(v),
  result: {
    externals: {
      [v]: {
        root: v,
        commonjs2: v,
        commonjs: v,
        amd: v
      }
    }
  }
})

export const addExternWithUMDName = (v1, v2) => ({
  fn: fns.addExtern(v1, v2),
  result: {
    externals: {
      [v1]: {
        root: v2,
        commonjs2: v1,
        commonjs: v1,
        amd: v1
      }
    }
  }
})

