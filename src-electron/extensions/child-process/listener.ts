import { sources, extensions } from './'
import { resolver as resolverInit, sender as senderInit } from 'ipc-promise-invoke'

const resolver = resolverInit(process)
const sender = senderInit(process)

resolver.addChannel('getExtensionList', () => {
  sender('extensionList', extensions.map((val) => ({
    id: val.id,
    name: val.name,
    version: val.version,
    description: val.description,
    author: val.author,
    homepage: val.homepage
  })))
})

resolver.addChannel('getSourceList', () => {
  sender('sourceList', sources.map((val) => ({
    id: val.id,
    name: val.name,
    description: val.description,
    provider: val.provider
  })))
})
