import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { appName } from './name'
const appData = app.getPath('appData')

export const dataPath = createNonExistingDiretory(path.join(appData, appName))

export const extensionPath = createNonExistingDiretory(path.join(dataPath, 'extensions'))

function createNonExistingDiretory(pathname: string) {
  const folderExists = fs.existsSync(pathname) && fs.lstatSync(pathname).isDirectory()
  if(!folderExists) {
    fs.mkdirSync(pathname)
  }
  return pathname
}