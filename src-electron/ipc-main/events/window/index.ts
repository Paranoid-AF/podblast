import mainWindow from '../../../windows/main'
const sendMessage = (type: 'maximize_main' | 'minimize_main' | 'restore_main') => {
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
}

export default registerEvents