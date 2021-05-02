import type { IpcMainInvokeEvent } from 'electron'
import { config } from '../../../confmgr'
import { AllConfig } from '../../../confmgr/subject'
import { sender } from '../../../extensions/ipc'

interface ExtensionAction {
  type: string,
  payload?: any
}

export const confmgr = (event: IpcMainInvokeEvent, action: ExtensionAction) => {
  switch(action.type) {
    case 'setConfig':
      (config as any)[action.payload.key as any] = action.payload.value
      break
  }
}