import R from 'ramda'
import deepmerge from 'deepmerge'
import uuid from 'node-uuid'
import { test } from 'ava'

import { base } from '../../'

const rand = () => ({
  a: uuid.v4(),
  b: uuid.v4(),
  r: uuid.v4()
})

const explainer = (expectation, result, path) => v => {
  if (v) return true
  const explanation = R.is(String, expectation)
    ? `expectation: "${expectation}"`
    : ''
  return {path, err: `failure at path "${path}"! got "${result}" ${explanation}`}
}

export const check = (t, expectation, result, path = []) => {
  const explain = explainer(expectation, result, path)
  if (R.is(Function, expectation)) return t.is(explain(expectation(result)), true)
  if (R.is(String, expectation)) return t.is(explain(expectation === result), true)
  if (R.is(Object, expectation)) {
    return Object.keys(expectation).map(key => {
      const thisExpectation = expectation[key]
      const thisResult = result[key]
      check(t, thisExpectation, thisResult, [...path, key])
    })
  }
  t.deepEqual(expectation, result)
}

export const testOne = (name, testCase) => {
  test(name, t => {
    const {a, b, c} = rand()
    let {fn, input, result} = testCase
    if (R.is(Function, testCase)) {
      const out = testCase(a, b, c)
      fn = out.fn
      input = out.input
      result = out.result
    }
    check(t, result, fn(input ? deepmerge(base, input) : base))
  })
}

export const testAll = cases => Object.entries(cases)
  .forEach(([name, testCase]) => testOne(name, testCase))

export const integrationTest = (name, entries) => {
  test(name, t => {
    const {expect, get} = entries.reduce(
      ({expect, get}, [fName, testCase]) => {
        let { result, input, fn } = testCase
        if (R.is(Function, testCase)) {
          const {a, b, c} = rand()
          const evaluated = testCase(a, b, c)
          result = evaluated.result
          input = evaluated.input
          fn = evaluated.fn
        }
        return {
          get: fn(input ? deepmerge(get, input) : get),
          expect: deepmerge(expect, result)
        }
      },
      {
        expect: {},
        get: base
      }
    )
    check(t, expect, get)
  })
}

