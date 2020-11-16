import { app } from 'electron'
import { initMainWindow } from './windows/main'
import { registerEvents } from './ipc-main'

app.on('ready', () => {
  initMainWindow()
  registerEvents()
})