const Vec3 = require('vec3').Vec3
const EventEmitter = require('events').EventEmitter

function posInChunk (pos) {
  return new Vec3(Math.floor(pos.x) & 15, Math.floor(pos.y), Math.floor(pos.z) & 15)
}

class WorldSync extends EventEmitter {
  constructor (world) {
    super()
    this.async = world
  }

  initialize (iniFunc, length, width, height = 256, iniPos = new Vec3(0, 0, 0)) {
    function inZone (x, y, z) {
      if (x >= width || x < 0) { return false }
      if (z >= length || z < 0) {
        return false
      }
      if (y >= height || y < 0) { return false }
      return true
    }
    const iniPosInChunk = posInChunk(iniPos)
    const chunkLength = Math.ceil((length + iniPosInChunk.z) / 16)
    const chunkWidth = Math.ceil((width + iniPosInChunk.x) / 16)
    for (let chunkZ = 0; chunkZ < chunkLength; chunkZ++) {
      const actualChunkZ = chunkZ + Math.floor(iniPos.z / 16)
      for (let chunkX = 0; chunkX < chunkWidth; chunkX++) {
        const actualChunkX = chunkX + Math.floor(iniPos.x / 16)
        const chunk = this.getColumn(actualChunkX, actualChunkZ)
        const offsetX = chunkX * 16 - iniPosInChunk.x
        const offsetZ = chunkZ * 16 - iniPosInChunk.z
        chunk.initialize((x, y, z) => inZone(x + offsetX, y - iniPos.y, z + offsetZ) ? iniFunc(x + offsetX, y - iniPos.y, z + offsetZ) : null)
        this.setColumn(actualChunkX, actualChunkZ, chunk)
      }
    }
  }

  unloadColumn (chunkX, chunkZ) {
    this.async.unloadColumn(chunkX, chunkZ)
  }

  getColumns () {
    return this.async.getColumns()
  }

  getColumn (chunkX, chunkZ) {
    return this.async.getLoadedColumn(chunkX, chunkZ)
  }

  getColumnAt (pos) {
    return this.async.getLoadedColumnAt(pos)
  }

  setColumn (chunkX, chunkZ, chunk, save = true) {
    return this.async.setLoadedColumn(chunkX, chunkZ, chunk, save)
  }

  // Block accessors:

  getBlock (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return null
    return chunk.getBlock(posInChunk(pos))
  }

  getBlockStateId (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getBlockStateId(posInChunk(pos))
  }

  getBlockType (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getBlockType(posInChunk(pos))
  }

  getBlockData (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getBlockData(posInChunk(pos))
  }

  getBlockLight (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getBlockLight(posInChunk(pos))
  }

  getSkyLight (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getSkyLight(posInChunk(pos))
  }

  getBiome (pos) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return 0
    return chunk.getBiome(posInChunk(pos))
  }

  setBlock (pos, block) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBlock(posInChunk(pos), block)
    this.async.saveAt(pos)
  }

  setBlockStateId (pos, stateId) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBlockStateId(posInChunk(pos), stateId)
    this.async.saveAt(pos)
  }

  setBlockType (pos, blockType) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBlockType(posInChunk(pos), blockType)
    this.async.saveAt(pos)
  }

  setBlockData (pos, data) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBlockData(posInChunk(pos), data)
    this.async.saveAt(pos)
  }

  setBlockLight (pos, light) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBlockLight(posInChunk(pos), light)
    this.async.saveAt(pos)
  }

  setSkyLight (pos, light) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setSkyLight(posInChunk(pos), light)
    this.async.saveAt(pos)
  }

  setBiome (pos, biome) {
    const chunk = this.getColumnAt(pos)
    if (!chunk) return
    chunk.setBiome(posInChunk(pos), biome)
    this.async.saveAt(pos)
  }
}

module.exports = WorldSync
