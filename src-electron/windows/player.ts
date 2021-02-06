import path from 'path'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import isDev from 'electron-is-dev'
import { Window } from './window'
import { shell } from 'electron/common'

const windowConf: BrowserWindowConstructorOptions = {
  show: false,
  webPreferences: {
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    preload: path.join(__dirname, '../ipc-renderer/index.js'),
    contextIsolation: true
  },
  frame: false,
  alwaysOnTop: true
}

var win: Window = {
  target: null
}

export const initPlayerWindow = () => {
  win.target = new BrowserWindow(windowConf)
  if(win.target === null) {
    return
  }
  win.target.setSkipTaskbar(true)
  if(isDev){
    win.target.loadURL(`http://localhost:3000/#/player-embedded`)
  }else{
    win.target.loadFile(path.join(__dirname, '../../build/index.html'), {
      hash: '#/player-embedded'
    })
  }
  win.target.webContents.on('new-window', (event: Electron.Event, url: string) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}

export default win