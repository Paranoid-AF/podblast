import { extensionProcess } from '../../../extensions'
import { sender } from '../../../extensions/ipc'

interface ExtensionPayload {
  action: string
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
  }
}