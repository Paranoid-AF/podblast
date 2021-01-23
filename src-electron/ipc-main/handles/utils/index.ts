import { shell } from 'electron'

interface UtilsPayload {
  action: 'openExplorer',
  payload: any
}

export const utils = (event: Electron.IpcMainInvokeEvent, payload: UtilsPayload) => {
  switch(payload.action) {
    case 'openExplorer':
      shell.openPath(payload.payload)
      break
  }
}