import mainWindow from '../../../windows/main'
enum ActionTypes {
  CLOSE = 'close',
  MINIMIZE = 'minimize',
  MAXIMIZE = 'maximize',
  RESTORE = 'restore'
}
export interface AppWindowAction {
  type: ActionTypes
}
export const appWindow = (event: Electron.IpcMainInvokeEvent, action: AppWindowAction) => {
  if(mainWindow.target === null) {
    return
  }
  switch(action.type) {
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
  }
}