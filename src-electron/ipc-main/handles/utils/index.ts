import type { IpcMainInvokeEvent } from 'electron'
import { shell } from 'electron'

interface UtilsAction {
  type: 'openExplorer',
  payload: any
}

export const utils = (event: IpcMainInvokeEvent, action: UtilsAction) => {
  switch(action.type) {
    case 'openExplorer':
      shell.openPath(action.payload)
      break
  }
}