import { config } from '../../../confmgr'
import { AllConfig } from '../../../confmgr/subject'
import { sender } from '../../../extensions/ipc'

interface ExtensionPayload {
  action: string,
  payload?: any
}

export const confmgr = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  switch(payload.action) {
    case 'setConfig':
      const key: keyof AllConfig = payload.payload.key
      const value: any = payload.payload.value
      config[key] = value
      break
  }
}