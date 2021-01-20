import { extensionProcess } from '../../../extensions'
import { sender as senderInit } from 'ipc-promise-invoke'

interface ExtensionPayload {
  action: string
}

export const extension = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  if(!extensionProcess) {
    return
  }
  const [ send, disband ] = senderInit(extensionProcess)
  switch(payload.action) {
    case 'updateExtensionList':
      send('getExtensionList')
      break
    case 'updateSourceList':
      send('getSourceList')
      break
  }
}