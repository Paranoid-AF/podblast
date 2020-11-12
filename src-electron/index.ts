import { BrowserWindow, app } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
app.on('ready', () => {
  var win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false
    },
    frame: false,
    transparent: true
  })
  if(isDev){
    win.loadURL(`http://localhost:3000/`)
  }else{
    win.loadFile(path.join(__dirname, '../build/index.html'))
  }
  win.on('ready-to-show', () => {
    win.show()
  })
  win.on('closed', () => {
    win.destroy()
  })
})