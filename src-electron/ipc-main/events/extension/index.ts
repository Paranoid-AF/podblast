import { ExtensionInfo, SourceInfo, extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage, sendNotification, NotificationMessage } from '../../../windows/main'
import mainWindow from '../../../windows/main'
import { resolver } from '../../../extensions/ipc'

export const cachedLists: Array< Array<ExtensionInfo> | Array<SourceInfo> > = [ [] , [] ]

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
    cachedLists[0] = lists[0]
    cachedLists[1] = lists[1]
    if(mainWindow.target !== null) {
      mainWindow.target.on('ready-to-show', () => {
        if(mainWindow.target !== null) {
          mainWindow.target.webContents.send('extension_ready', cachedLists)
        }
      })
    }
  })

  addChannel('extensionList', (extensionList: any) => {
    cachedLists[0] = extensionList
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('extension_list', extensionList)
    }
  })

  addChannel('sourceList', (sourceList: any) => {
    cachedLists[1] = sourceList
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('source_list', sourceList)
    }
  })

}

export default registerEvents