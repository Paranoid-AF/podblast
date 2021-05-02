import { disableExtension, enableExtension, removeExtension } from '../../../extensions'
import { sender } from '../../../extensions/ipc'
import type { FormItem, SourceResult } from '../../../extensions/child-process'

interface ExtensionAction {
  type: string,
  payload?: any
}

export const extension = async (event: Electron.IpcMainInvokeEvent, action: ExtensionAction) => {
  const [ send, disband ] = sender
  switch(action.type) {
    case 'updateExtensionList':
      send('getExtensionList')
      break
    case 'updateSourceList':
      send('getSourceList')
      break
    case 'removeExtension':
      return removeExtension(action.payload as string)
    case 'disableExtension':
      return disableExtension(action.payload as string)
    case 'enableExtension':
      return enableExtension(action.payload as string)
    case 'getSourceForm':
      return (send('getForm', {id: action.payload.id, provider: action.payload.provider}) as Promise<Array<FormItem>>)
    case 'submitSourceForm':
      const result = await (send('submitForm', {id: action.payload.id, provider: action.payload.provider, data: action.payload.content}) as Promise<SourceResult | null>)
      if(result) {
        result['params'] = action.payload.content
      }
      return result
  }
}