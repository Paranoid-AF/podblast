import { app, dialog } from 'electron'
import { initMainWindow } from './windows/main'
import { initPlayerWindow } from './windows/player'
import { startExtensionProcess } from './extensions'
import { registerEvents } from './ipc-main'
import { initDatabase } from './data'
import { profilePath } from './constants/path'

app.on('ready', () => {
  initDatabase()
    .then(() => {
      initMainWindow()
      initPlayerWindow()
      startExtensionProcess()
      registerEvents()
    })
    .catch(err => {
      console.error(err)
      dialog.showMessageBoxSync({
        type: 'warning',
        title: 'Database Error',
        message: 'Unable to establish connection to local database or the database is broken, at: \n' + profilePath
      })
      app.quit()
    })
})

export default app