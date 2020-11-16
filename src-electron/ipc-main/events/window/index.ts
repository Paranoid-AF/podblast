import mainWindow from '../../../windows/main'
const sendMessage = (type: 'maximized' | 'minimized' | 'restored') => {
  if(mainWindow.target !== null) {
    mainWindow.target.webContents.send(type)
  }
}

const registerEvents = () => {
  if(mainWindow.target === null) {
    return
  }

  mainWindow.target.on('maximize', () => {
    sendMessage("maximized")
  })
  
  mainWindow.target.on('minimize', () => {
    sendMessage("minimized")
  })
  
  mainWindow.target.on('restore', () => {
    sendMessage("restored")
  })
}

export default registerEvents