import * as cases from './helpers/cases'
import { testAll, integrationTest } from './helpers/util'

testAll(cases)
integrationTest('frontwards', Object.entries(cases))
integrationTest('backwards', Object.entries(cases).reverse())

