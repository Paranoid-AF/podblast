import { app } from 'electron'
import path from 'path'
import child_process, { ChildProcess } from 'child_process'
import isDev from 'electron-is-dev'
export let extensionProcess: ChildProcess | null = null

export const startExtensionProcess = () => {
  const locale = app.getLocale()
  extensionProcess = child_process.fork(path.join(__dirname, './child-process/index.js'), [], {
    env: {
      locale,
      dev: isDev.toString()
    }
  })
}