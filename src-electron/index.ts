import { app } from 'electron'
import { initMainWindow } from './windows/main'
import './ipc-main'

app.on('ready', () => {
  initMainWindow()
})