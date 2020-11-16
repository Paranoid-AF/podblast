import mainWindow from '../../../windows/main'
enum ActionTypes {
  CLOSE = 'close',
  MINIMIZE = 'minimize',
  MAXIMIZE = 'maximize',
  RESTORE = 'restore',
  IS_MAXIMIZED = 'isMaximized'
}
export interface appWindowPayload {
  action: ActionTypes
}
export const appWindow = (event: Electron.IpcMainInvokeEvent, payload: appWindowPayload) => {
  if(mainWindow.target === null) {
    return
  }
  switch(payload.action) {
    case ActionTypes.CLOSE:
      mainWindow.target.close()
      break
    case ActionTypes.MINIMIZE:
      mainWindow.target.minimize()
      break
    case ActionTypes.MAXIMIZE:
      mainWindow.target.maximize()
      break
    case ActionTypes.RESTORE:
      mainWindow.target.restore()
      break
    case ActionTypes.IS_MAXIMIZED:
      return mainWindow.target.isMaximized()
  }
}