import { BrowserWindow, app, BrowserWindowConstructorOptions } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';

app.on('ready', () => {
  const windowConf: BrowserWindowConstructorOptions = {
    show: false,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false
    }
  }
  windowConf.frame = false

  var win = new BrowserWindow(windowConf)
  if(isDev){
    win.loadURL(`http://localhost:3000/`)
  }else{
    win.loadFile(path.join(__dirname, '../build/index.html'))
  }
  win.on('ready-to-show', () => {
    win.show()
    win.setSize(800, 600) // Set this to make the window always resizable on Linux.
  })
  win.on('closed', () => {
    win.destroy()
  })
})