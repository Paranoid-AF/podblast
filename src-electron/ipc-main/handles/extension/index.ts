import { extensionProcess, removeExtension } from '../../../extensions'
import { sender } from '../../../extensions/ipc'

interface ExtensionPayload {
  action: string,
  payload?: any
}

export const extension = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  const [ send, disband ] = sender
  switch(payload.action) {
    case 'updateExtensionList':
      send('getExtensionList')
      break
    case 'updateSourceList':
      send('getSourceList')
      break
    case 'removeExtension':
      return removeExtension(payload.payload as string)
  }
}