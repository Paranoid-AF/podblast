import mainWindow from '../../../windows/main'
export interface appWindowPayload {
  action: 'close' | 'minimize' | 'maximize' | 'restore'
}
export const appWindow = (event: Electron.IpcMainInvokeEvent, payload: appWindowPayload) => {
  if(mainWindow.target === null) {
    return
  }
  switch(payload.action) {
    case 'close':
      mainWindow.target.close()
      break
    case 'minimize':
      mainWindow.target.minimize()
      break
    case 'maximize':
      mainWindow.target.maximize()
      break
    case 'restore':
      mainWindow.target.restore()
      break
  }
}