import { extensionProcess, ExtensionMessage } from '../../../extensions'
import { sendPopupMessage, PopupMessage } from '../../../windows/main'
import mainWindow from '../../../windows/main'

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }
  extensionProcess.on('message', (msg: ExtensionMessage) => {
    if(!mainWindow.target) {
      return
    }

    if(msg.type === 'popup') {
      sendPopupMessage(msg.action as PopupMessage)
    }

    if(msg.type === 'extensionReady') {
      if(mainWindow.target !== null) {
        mainWindow.target.on('ready-to-show', () => {
          if(mainWindow.target !== null) {
            mainWindow.target.webContents.send('extension_ready')
          }
        })
        mainWindow.target.webContents.send('extension_ready')
      }
    }

    if(msg.type === 'extensionList') {
      mainWindow.target.webContents.send('extension_list', msg.action)
    }

    if(msg.type === 'sourceList') {
      mainWindow.target.webContents.send('source_list', msg.action)
    }

  })
}

export default registerEvents