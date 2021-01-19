# prismarine-world

[![NPM version](https://img.shields.io/npm/v/prismarine-world.svg)](http://npmjs.com/package/prismarine-world)
[![Build Status](https://github.com/PrismarineJS/prismarine-world/workflows/CI/badge.svg)](https://github.com/PrismarineJS/prismarine-world/actions?query=workflow%3A%22CI%22)
[![Discord](https://img.shields.io/badge/chat-on%20discord-brightgreen.svg)](https://discord.gg/GsEFRM8)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-brightgreen.svg)](https://gitter.im/PrismarineJS/general)
[![Irc](https://img.shields.io/badge/chat-on%20irc-brightgreen.svg)](https://irc.gitter.im/)

[![Try it on gitpod](https://img.shields.io/badge/try-on%20gitpod-brightgreen.svg)](https://gitpod.io/#https://github.com/PrismarineJS/prismarine-world)

## Usage

See [anvil.js](examples/anvil.js)

## Related packages

* [prismarine-viewer](https://github.com/PrismarineJS/prismarine-viewer) to view a world
* [mineflayer](https://github.com/PrismarineJS/mineflayer) to use a world in a mc client
* [flying-squid](https://github.com/PrismarineJS/flying-squid) to serve a world from a mc server
* [schematic-to-world](https://github.com/rom1504/schematic-to-world) to add a mc schematic to a world

## Available Storage Providers

* [prismarine-provider-anvil](https://github.com/PrismarineJS/prismarine-provider-anvil) Anvil (Minecraft's world format) based storage
* [prismarine-provider-raw](https://github.com/PrismarineJS/prismarine-provider-raw) Prismarine-chunk based raw storage

## API

The API is split in 2 :
* the World which is async 
* the World.sync which is sync

The characteristics of the async world is that it will always return something when getting a block, but as a promise. To achieve this it 
may load columns from anvil files or other storage. On the other hand the sync world will not always return blocks and may return null, 
but it will return the block directly with no promise.

The set operations have similar characteristics : the async world will always set the blocks and return a promise, whereas the sync world will 
not always set the blocks, but do the action now and not return a promise.

The 2 world are linked and stay in sync together.

The async world may be more natural for servers (although the sync world can also be used there)
The sync world makes more sense for clients as there is not necessarily somewhere to load more data from (but in some cases this may be incorrect too, think 
multi player clients)

### World

#### World([generateChunk,[storageProvider]],[savingInterval])

Create a world instance, takes an optional `generateChunk(chunkX, chunkZ)` function that will get called when a chunk at 
`chunkX` and `chunkZ` need to be generated. Takes a second optional arguments : `storageProvider` containing the regions.
If provided, prismarine-world will first try to load the map from these regions, and then try to generate the world if 
the chunk isn't saved. `savingInterval` default to 50ms.

#### World.initialize(iniFunc,length,width,height=256,iniPos=new Vec3(0,0,0))

Initialize the world with a given blocks cube. Useful to load quickly a schematic.

* `iniFunc` is a function(x,y,z) that returns a prismarine-block
* `length`, `width` and `height` are the size to iterate on
* `iniPos` is the position where to start the iteration

Returns a promise containing an array of `{chunkX,chunkZ}`

#### World.getColumns()

Return all loaded columns

#### World.unloadColumn(chunkX,chunkZ)

Unload column from memory

All the following methods are async and return a promise.

#### World.setColumn(chunkX,chunkZ,chunk)

Set `chunk` at `chunkX` and `chunkZ`

#### World.getColumn(chunkX,chunkZ)

Return the column at `chunkX` and `chunkZ`

#### World.getBlock(pos)

Get the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

#### World.setBlock(pos,block)

Set the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

#### World.getBlockStateId(pos)

Get the block state at `pos`

#### World.getBlockType(pos)

Get the block type at `pos`

#### World.getBlockData(pos)

Get the block data (metadata) at `pos`

#### World.getBlockLight(pos)

Get the block light at `pos`

#### World.getSkyLight(pos)

Get the block sky light at `pos`

#### World.getBiome(pos)

Get the block biome id at `pos`

#### World.setBlockStateId(pos, stateId)

Set the block state `stateId` at `pos`

#### World.setBlockType(pos, id)

Set the block type `id` at `pos`

#### World.setBlockData(pos, data)

Set the block `data` (metadata) at `pos`

#### World.setBlockLight(pos, light)

Set the block `light` at `pos`

#### World.setSkyLight(pos, light)

Set the block sky `light` at `pos`

#### World.setBiome(pos, biome)

Set the block `biome` id at `pos`

#### World.waitSaving()

Returns a promise that is resolved when all saving is done.

#### World.sync(asyncWorld)

Build a sync world, will delegate all the saving work to the async one

#### World.initialize(iniFunc,length,width,height=256,iniPos=new Vec3(0,0,0))

Initialize the world with a given blocks cube. Useful to load quickly a schematic.

* `iniFunc` is a function(x,y,z) that returns a prismarine-block
* `length`, `width` and `height` are the size to iterate on
* `iniPos` is the position where to start the iteration

Returns an array of `{chunkX,chunkZ}`

This works only on loaded columns.

#### World.sync.getColumns()

Return all loaded columns

All the following methods are sync.

#### World.sync.unloadColumn(chunkX,chunkZ)

Unload column from memory

#### World.sync.setColumn(chunkX,chunkZ,chunk)

Set `chunk` at `chunkX` and `chunkZ`

#### World.sync.getColumn(chunkX,chunkZ)

Return the column at `chunkX` and `chunkZ`

#### World.sync.getBlock(pos)

Get the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

#### World.sync.setBlock(pos,block)

Set the [Block](https://github.com/PrismarineJS/prismarine-block) at [pos](https://github.com/andrewrk/node-vec3)

#### World.sync.getBlockStateId(pos)

Get the block state at `pos`

#### World.sync.getBlockType(pos)

Get the block type at `pos`

#### World.sync.getBlockData(pos)

Get the block data (metadata) at `pos`

#### World.sync.getBlockLight(pos)

Get the block light at `pos`

#### World.sync.getSkyLight(pos)

Get the block sky light at `pos`

#### World.sync.getBiome(pos)

Get the block biome id at `pos`

#### World.sync.setBlockStateId(pos, stateId)

Set the block state `stateId` at `pos`

#### World.sync.setBlockType(pos, id)

Set the block type `id` at `pos`

#### World.sync.setBlockData(pos, data)

Set the block `data` (metadata) at `pos`

#### World.sync.setBlockLight(pos, light)

Set the block `light` at `pos`

#### World.sync.setSkyLight(pos, light)

Set the block sky `light` at `pos`

#### World.sync.setBiome(pos, biome)

Set the block `biome` id at `pos`

## History

### 3.1.1

* fix world.sync.getChunks()

### 3.1.0

* implement unload column

### 3.0.0

* BREAKING: regionFolder is now a provider (for example an Anvil instance)

### 2.3.0

* add .sync

### 2.2.0

* add get/set block state id
* perf improvement of saving (thanks @Karang)

### 2.1.0

* disable saving if savingInterval is 0
* standardjs
* no gulp

### 2.0.0

* cross version support

### 1.0.2

* update dependencies, fix issue with provider anvil

### 1.0.1

* update to babel6

### 1.0.0

* bump dependencies

### 0.5.5

* bump prismarine-provider-anvil

### 0.5.4

* fix negative iniPos in initialize

### 0.5.3

* fix initialize

### 0.5.2

* bump prismarine-chunk

### 0.5.1

* fix initialize for iniPos%16 !=0

### 0.5.0

* add World.initialize

### 0.4.0

* use prismarine-provide-anvil 0.1.0 to implement anvil loading and saving

### 0.3.3

* fix minecraft-chunk bug

### 0.3.2

* fix getBlockData

### 0.3.1

* check if the region is available in the anvil files

### 0.3.0

* Add anvil loading

### 0.2.0

* Add chunk generation to the API

### 0.1.0

* First version, basic functionality
