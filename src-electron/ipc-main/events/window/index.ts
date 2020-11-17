import mainWindow from '../../../windows/main'
import { getPlatform } from '../../../constants/os'
const sendMessage = (type: 'maximize_main' | 'minimize_main' | 'restore_main' | 'close_main') => {
  if(mainWindow.target !== null) {
    mainWindow.target.webContents.send(type)
  }
}

const registerEvents = () => {
  if(mainWindow.target === null) {
    return
  }

  mainWindow.target.on('maximize', () => {
    sendMessage("maximize_main")
  })
  
  mainWindow.target.on('minimize', () => {
    sendMessage("minimize_main")
  })
  
  mainWindow.target.on('restore', () => {
    sendMessage("restore_main")
  })

  mainWindow.target.on('close', () => {
    sendMessage("close_main")
  })

  mainWindow.target.on('ready-to-show', () => {
    if(mainWindow.target !== null) {
      mainWindow.target.webContents.send('ready_main', {
        platform: getPlatform(),
        isMaximized: mainWindow.target.isMaximized()
      })
    }
  })
}

export default registerEvents