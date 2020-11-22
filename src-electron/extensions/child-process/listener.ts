import { sources, extensions } from './'
import type { ExtensionMessage } from '../'
process.on('message', (msg) => {
  if(typeof process === 'undefined' || typeof process.send === 'undefined') {
    return
  }
  if(msg === 'extension_list') {
    process.send({
      type: 'extensionList',
      action: extensions.map((val) => ({
        id: val.id,
        name: val.name,
        version: val.version,
        description: val.description,
        author: val.author,
        homepage: val.homepage
      }))
    } as ExtensionMessage)
  }
  if(msg === 'source_list') {
    process.send({
      type: 'sourceList',
      action: sources.map((val) => ({
        id: val.id,
        name: val.name,
        description: val.description,
        provider: val.provider
      }))
    } as ExtensionMessage)
  }
})