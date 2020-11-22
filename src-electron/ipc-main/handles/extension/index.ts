import { extensionProcess } from '../../../extensions'

interface ExtensionPayload {
  action: string
}

export const extension = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  if(!extensionProcess) {
    return
  }
  switch(payload.action) {
    case 'updateExtensionList':
      extensionProcess.send('extension_list')
      break
    case 'updateSourceList':
      extensionProcess.send('source_list')
      break
  }
}