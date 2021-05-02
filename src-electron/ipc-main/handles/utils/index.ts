import { shell } from 'electron'

interface UtilsAction {
  type: 'openExplorer',
  payload: any
}

export const utils = (event: Electron.IpcMainInvokeEvent, action: UtilsAction) => {
  switch(action.type) {
    case 'openExplorer':
      shell.openPath(action.payload)
      break
  }
}