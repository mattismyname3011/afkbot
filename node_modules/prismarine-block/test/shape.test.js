/* eslint-env jest */

const testedVersions = require('..').testedVersions
const assert = require('assert')

testedVersions.forEach(version => {
  describe(version, () => {
    const blockArray = require('minecraft-data')(version).blocksArray
    const Block = require('../')(version)
    blockArray.forEach(block => {
      test('shape ' + block.name, () => {
        const blockV = new Block(block.id, 0, 0, block.defaultState)
        assert.ok(blockV.shapes !== undefined)
        if (blockV.missingStateShape !== undefined) {
          console.log(`state shape of ${block.name} is missing`)
        }
      })
    })
  })
})
