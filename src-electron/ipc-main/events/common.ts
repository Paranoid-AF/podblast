import mainWindow from '../../windows/main'

export const sendMessage = (channel: string, ...args: any) => {
  if(mainWindow.target !== null) {
    mainWindow.target.webContents.send.apply(mainWindow.target.webContents, [channel, ...args])
  }
}