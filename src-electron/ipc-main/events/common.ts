import mainWindow from '../../windows/main'

export const sendMessage = (type: string, payload?: any) => {
  if(mainWindow.target !== null) {
    mainWindow.target.webContents.send(type, payload)
  }
}