import { BrowserWindow, app, BrowserWindowConstructorOptions } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';

import { getPlatform, Platforms } from './constants/os'

app.on('ready', () => {
  const osPlatform = getPlatform()
  const windowConf: BrowserWindowConstructorOptions = {
    show: false,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false
    }
  }
  /* Frameless and transparent only works well on Windows */
  if(osPlatform === Platforms.WINDOWS) {
    windowConf.frame = false
    windowConf.transparent = true
    windowConf.maximizable = false // But maximize works incorrectly without frames on Windows
  }

  var win = new BrowserWindow(windowConf)
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