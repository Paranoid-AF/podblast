import { app, dialog } from 'electron'
import { initMainWindow } from './windows/main'
import { startExtensionProcess } from './extensions'
import { registerEvents } from './ipc-main'
import { initDatabase } from './data'
import { profilePath } from './constants/path'

app.on('ready', () => {
  initDatabase()
    .then(() => {
      initMainWindow()
      startExtensionProcess()
      registerEvents()
    })
    .catch(err => {
      console.error(err)
      dialog.showMessageBoxSync({
        type: 'warning',
        title: 'Database Error',
        message: 'Unable to establish connection to local database, at: \n' + profilePath
      })
      app.quit()
    })
})

export default app