import { sources, extensions } from './'
import type { ExtensionMessage, ReqBody, ResBody } from '../'

const signature = "extension_call_recv"

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

/* Handle Promisified requests */
process.on('message', async (msg: ReqBody) => {
  if(msg.ipcSignature === signature && msg.uuid) {
    let status: ResBody['status'] = 'success'
    let payload: any = null
    
    switch(msg.action) {
      case 'ping':
        await new Promise((resolve) => { setTimeout(resolve, 2000) })
        payload = msg.payload + ` Pong!`
        break
    }

    if(process.send) {
      process.send({
        status,
        payload,
        uuid: msg.uuid,
        ipcSignature: signature
      } as ResBody)
    }
  }
})