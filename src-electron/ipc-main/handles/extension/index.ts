import { extensionProcess } from '../../../extensions'
import { sender as senderInit } from 'ipc-promise-invoke'

interface ExtensionPayload {
  action: string
}

export const extension = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  if(!extensionProcess) {
    return
  }
  const sender = senderInit(extensionProcess)
  switch(payload.action) {
    case 'updateExtensionList':
      sender('getExtensionList')
      break
    case 'updateSourceList':
      sender('getSourceList')
      break
  }
}