import { sources, extensions } from './'
import { resolver as resolverInit, sender as senderInit } from 'ipc-promise-invoke'

const resolver = resolverInit(process)
const sender = senderInit(process)

resolver.addChannel('getExtensionList', () => {
  sender('extensionList', extensions)
})

resolver.addChannel('getSourceList', () => {
  sender('sourceList', sources.map((val) => {
    const properties: Record<string, any> = { }
    for(let key in val) {
      if(typeof val[key as keyof typeof val] !== 'function') {
        properties[key] = val[key as keyof typeof val]
      }
    }
    return properties
  }))
})
