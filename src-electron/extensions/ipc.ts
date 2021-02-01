import { sender as senderInit, resolver as resolverInit } from 'ipc-promise-invoke'
import { extensionProcess } from './'

export const resolver: ReturnType<typeof resolverInit> = [
  (channel: string, action: (...args: any) => any) => {},
  (channel: string) => {},
  () => {}
]
export const sender: ReturnType<typeof senderInit> = [
  async (channel: string, ...payload: any) => {},
  () => {}
]

export const buildIpcBridge = () => {
  if(extensionProcess){
    resolver.splice(0, 3)
    resolver.push.apply(resolver, resolverInit(extensionProcess))
    sender.splice(0, 2)
    sender.push.apply(sender, senderInit(extensionProcess))
  }
}
