import { disableExtension, enableExtension, removeExtension } from '../../../extensions'
import { sender } from '../../../extensions/ipc'
import type { FormItem, SourceResult } from '../../../extensions/child-process'

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
    case 'disableExtension':
      return disableExtension(payload.payload as string)
    case 'enableExtension':
      return enableExtension(payload.payload as string)
    case 'getSourceForm':
      return (send('getForm', {id: payload.payload.id, provider: payload.payload.provider}) as Promise<Array<FormItem>>)
    case 'submitSourceForm':
      return (send('submitForm', {id: payload.payload.id, provider: payload.payload.provider, data: payload.payload.content}) as Promise<SourceResult | null>)
  }
}