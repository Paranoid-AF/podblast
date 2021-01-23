import { resolver as resolverInit, sender as senderInit } from 'ipc-promise-invoke'
export const sender = senderInit(process)
export const resolver = resolverInit(process)