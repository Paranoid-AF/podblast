import { app } from 'electron'
import { initMainWindow } from './windows/main'
import { startExtensionProcess } from './extensions'
import { registerEvents } from './ipc-main'

app.on('ready', () => {
  initMainWindow()
  startExtensionProcess()
  registerEvents()
})

export default app