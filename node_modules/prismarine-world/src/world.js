const Vec3 = require('vec3').Vec3
const WorldSync = require('./worldsync.js')
const EventEmitter = require('events').EventEmitter
const once = require('event-promise')

function columnKeyXZ (chunkX, chunkZ) {
  return chunkX + ',' + chunkZ
}

function posInChunk (pos) {
  return new Vec3(Math.floor(pos.x) & 15, Math.floor(pos.y), Math.floor(pos.z) & 15)
}

class World extends EventEmitter {
  constructor (chunkGenerator, storageProvider = null, savingInterval = 1000) {
    super()
    this.savingQueue = new Map()
    this.finishedSaving = Promise.resolve()
    this.columns = {}
    this.chunkGenerator = chunkGenerator
    this.storageProvider = storageProvider
    this.savingInterval = savingInterval
    this.sync = new WorldSync(this)
    if (storageProvider && savingInterval !== 0) this.startSaving()
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
    const ps = []
    const iniPosInChunk = posInChunk(iniPos)
    const chunkLength = Math.ceil((length + iniPosInChunk.z) / 16)
    const chunkWidth = Math.ceil((width + iniPosInChunk.x) / 16)
    for (let chunkZ = 0; chunkZ < chunkLength; chunkZ++) {
      const actualChunkZ = chunkZ + Math.floor(iniPos.z / 16)
      for (let chunkX = 0; chunkX < chunkWidth; chunkX++) {
        const actualChunkX = chunkX + Math.floor(iniPos.x / 16)
        ps.push(this.getColumn(actualChunkX, actualChunkZ)
          .then(chunk => {
            const offsetX = chunkX * 16 - iniPosInChunk.x
            const offsetZ = chunkZ * 16 - iniPosInChunk.z
            chunk.initialize((x, y, z) => inZone(x + offsetX, y - iniPos.y, z + offsetZ) ? iniFunc(x + offsetX, y - iniPos.y, z + offsetZ) : null)
            return this.setColumn(actualChunkX, actualChunkZ, chunk)
          })
          .then(() => ({ chunkX: actualChunkX, chunkZ: actualChunkZ })))
      }
    }
    return Promise.all(ps)
  }

  getLoadedColumn (chunkX, chunkZ) {
    const key = columnKeyXZ(chunkX, chunkZ)
    return this.columns[key]
  }

  async getColumn (chunkX, chunkZ) {
    await Promise.resolve()
    const key = columnKeyXZ(chunkX, chunkZ)

    if (!this.columns[key]) {
      let chunk = null
      if (this.storageProvider != null) {
        const data = await this.storageProvider.load(chunkX, chunkZ)
        if (data != null) { chunk = data }
      }
      const loaded = chunk != null
      if (!loaded && this.chunkGenerator) {
        chunk = this.chunkGenerator(chunkX, chunkZ)
      }
      if (chunk != null) { await this.setColumn(chunkX, chunkZ, chunk, !loaded) }
    }

    return this.columns[key]
  }

  setLoadedColumn (chunkX, chunkZ, chunk, save = true) {
    const key = columnKeyXZ(chunkX, chunkZ)
    this.columns[key] = chunk

    if (this.storageProvider && save) { this.queueSaving(chunkX, chunkZ) }
  }

  async setColumn (chunkX, chunkZ, chunk, save = true) {
    await Promise.resolve()
    this.setLoadedColumn(chunkX, chunkZ, chunk, save)
  }

  unloadColumn (chunkX, chunkZ) {
    const key = columnKeyXZ(chunkX, chunkZ)
    delete this.columns[key]
  }

  async saveNow () {
    if (this.savingQueue.size === 0) {
      return
    }
    // We could set a limit on the number of chunks to save at each
    // interval. The set structure is maintaining the order of insertion
    for (const [key, { chunkX, chunkZ }] of this.savingQueue.entries()) {
      this.finishedSaving = Promise.all([this.finishedSaving,
        this.storageProvider.save(chunkX, chunkZ, this.columns[key])])
    }
    this.savingQueue.clear()
    this.emit('doneSaving')
  }

  startSaving () {
    this.savingInt = setInterval(async () => {
      await this.saveNow()
    }, this.savingInterval)
  }

  async waitSaving () {
    await this.saveNow()
    if (this.savingQueue.size > 0) {
      await once(this, 'doneSaving')
    }
    await this.finishedSaving
  }

  stopSaving () {
    clearInterval(this.savingInt)
  }

  queueSaving (chunkX, chunkZ) {
    this.savingQueue.set(columnKeyXZ(chunkX, chunkZ), { chunkX, chunkZ })
  }

  saveAt (pos) {
    var chunkX = Math.floor(pos.x / 16)
    var chunkZ = Math.floor(pos.z / 16)
    if (this.storageProvider) { this.queueSaving(chunkX, chunkZ) }
  }

  getColumns () {
    return Object.entries(this.columns).map(([key, column]) => {
      const parts = key.split(',')
      return {
        chunkX: parts[0],
        chunkZ: parts[1],
        column
      }
    })
  }

  getLoadedColumnAt (pos) {
    const chunkX = Math.floor(pos.x / 16)
    const chunkZ = Math.floor(pos.z / 16)
    return this.getLoadedColumn(chunkX, chunkZ)
  }

  async getColumnAt (pos) {
    var chunkX = Math.floor(pos.x / 16)
    var chunkZ = Math.floor(pos.z / 16)
    return this.getColumn(chunkX, chunkZ)
  }

  async setBlock (pos, block) {
    (await this.getColumnAt(pos)).setBlock(posInChunk(pos), block)
    this.saveAt(pos)
  }

  async getBlock (pos) {
    return (await this.getColumnAt(pos)).getBlock(posInChunk(pos))
  }

  async getBlockStateId (pos) {
    return (await this.getColumnAt(pos)).getBlockStateId(posInChunk(pos))
  }

  async getBlockType (pos) {
    return (await this.getColumnAt(pos)).getBlockType(posInChunk(pos))
  }

  async getBlockData (pos) {
    return (await this.getColumnAt(pos)).getBlockData(posInChunk(pos))
  }

  async getBlockLight (pos) {
    return (await this.getColumnAt(pos)).getBlockLight(posInChunk(pos))
  }

  async getSkyLight (pos) {
    return (await this.getColumnAt(pos)).getSkyLight(posInChunk(pos))
  }

  async getBiome (pos) {
    return (await this.getColumnAt(pos)).getBiome(posInChunk(pos))
  }

  async setBlockStateId (pos, stateId) {
    (await this.getColumnAt(pos)).setBlockStateId(posInChunk(pos), stateId)
    this.saveAt(pos)
  }

  async setBlockType (pos, blockType) {
    (await this.getColumnAt(pos)).setBlockType(posInChunk(pos), blockType)
    this.saveAt(pos)
  }

  async setBlockData (pos, data) {
    (await this.getColumnAt(pos)).setBlockData(posInChunk(pos), data)
    this.saveAt(pos)
  }

  async setBlockLight (pos, light) {
    (await this.getColumnAt(pos)).setBlockLight(posInChunk(pos), light)
    this.saveAt(pos)
  }

  async setSkyLight (pos, light) {
    (await this.getColumnAt(pos)).setSkyLight(posInChunk(pos), light)
    this.saveAt(pos)
  }

  async setBiome (pos, biome) {
    (await this.getColumnAt(pos)).setBiome(posInChunk(pos), biome)
    this.saveAt(pos)
  }
}

function loader (mcVersion) {
  return World
}

module.exports = loader
