import { extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage, sendNotification, NotificationMessage } from '../../../windows/main'
import mainWindow from '../../../windows/main'
import { resolver } from '../../../extensions/ipc'

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }

  const [ addChannel, cancelChannel, disband ] = resolver

  addChannel('popup', (msg: PopupMessage) => {
    sendPopupMessage(msg)
  })

  addChannel('notification', (msg: NotificationMessage) => {
    sendNotification(msg)
  })

  addChannel('extensionReady', (lists: any) => {
    if(mainWindow.target !== null) {
      mainWindow.target.on('ready-to-show', () => {
        if(mainWindow.target !== null) {
          mainWindow.target.webContents.send('extension_ready', lists)
        }
      })
    }
  })

  addChannel('extensionList', (extensionList: any) => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('extension_list', extensionList)
    }
  })

  addChannel('sourceList', (sourceList: any) => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('source_list', sourceList)
    }
  })

}

export default registerEvents