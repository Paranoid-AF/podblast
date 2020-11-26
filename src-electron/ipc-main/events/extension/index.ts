import { extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage } from '../../../windows/main'
import mainWindow from '../../../windows/main'
import { resolver as resolverInit } from 'ipc-promise-invoke'

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }
  const resolver = resolverInit(extensionProcess)

  resolver.addChannel('popup', (msg: PopupMessage) => {
    sendPopupMessage(msg)
  })

  resolver.addChannel('extensionReady', () => {
    if(mainWindow.target !== null) {
      mainWindow.target.on('ready-to-show', () => {
        if(mainWindow.target !== null) {
          mainWindow.target.webContents.send('extension_ready')
        }
      })
      mainWindow.target.webContents.send('extension_ready')
    }
  })

  resolver.addChannel('extensionList', (extensionList) => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('extension_list', extensionList)
    }
  })

  resolver.addChannel('sourceList', (sourceList) => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('source_list', sourceList)
    }
  })

}

export default registerEvents