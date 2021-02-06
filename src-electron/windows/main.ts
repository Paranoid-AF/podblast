import { app, BrowserWindow, shell } from 'electron'
import windowConf from './config'
import path from 'path'
import isDev from 'electron-is-dev'
import { Window } from './window'

var win: Window = {
  target: null
}

export const initMainWindow = () => {
  win.target = new BrowserWindow(windowConf)
  if(win.target === null) {
    return
  }
  if(isDev){
    win.target.loadURL(`http://localhost:3000/`)
  }else{
    win.target.loadFile(path.join(__dirname, '../../build/index.html'))
  }
  win.target.on('ready-to-show', () => {
    if(win.target !== null) {
      win.target.show()
      win.target.setSize(1130, 680)
    }
  })
  win.target.on('closed', () => {
    if(win.target !== null) {
      win.target.destroy()
      app.quit()
    }
  })
  win.target.webContents.on('new-window', (event: Electron.Event, url: string) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}

export const sendPopupMessage = (msg: PopupMessage) => {
  if(win.target) {
    win.target.webContents.once('dom-ready', () => {
      if(win.target) {
        win.target.webContents.send('popup', msg)
      }
    })
    win.target.webContents.send('popup', msg)
  }
}

export const sendNotification = (msg: NotificationMessage) => {
  if(win.target) {
    win.target.webContents.once('dom-ready', () => {
      if(win.target) {
        win.target.webContents.send('notification', msg)
      }
    })
    win.target.webContents.send('notification', msg)
  }
}

export interface PopupMessage {
  icon: 'info' | 'success' | 'warning' | 'normal' | 'error',
  content: string
}

export interface NotificationMessage {
  title?: string,
  content: string,
  duration?: number
}

export default win