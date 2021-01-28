import { app } from 'electron'
import { initMainWindow } from './windows/main'
import { startExtensionProcess } from './extensions'
import { registerEvents } from './ipc-main'
import { initDatabase } from './data'

initDatabase()

app.on('ready', () => {
  initMainWindow()
  startExtensionProcess()
  registerEvents()
})

export default app