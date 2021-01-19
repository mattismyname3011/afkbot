/* eslint-env mocha */

describe('load', () => {
  it('loads the lib', () => {
    require('minecraft-data')
    require('../example')
  })
  it('run the example', () => {
    require('../example')
  })
})
