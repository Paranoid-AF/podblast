import { sender as senderInit, resolver as resolverInit } from 'ipc-promise-invoke'
import { extensionProcess } from './'

export const resolver: Array<any> = []
export const sender: Array<any> = []

export const buildIpcBridge = () => {
  if(extensionProcess){
    resolver.push.apply(resolver, resolverInit(extensionProcess))
    sender.push.apply(sender, senderInit(extensionProcess))
  }
}
