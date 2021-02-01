import path from 'path'
import fs from 'fs'
import { getOverrideValue, defaultDataPath } from '../confmgr/override'

export const dataPath = createNonExistingDiretory(getOverrideValue('file.profileLocation') ?? defaultDataPath)

export const extensionPath = createNonExistingDiretory(path.join(dataPath, 'extensions'))

export const profilePath = createNonExistingDiretory(path.join(dataPath, 'userdata'))

function createNonExistingDiretory(pathname: string) {
  const folderExists = fs.existsSync(pathname) && fs.lstatSync(pathname).isDirectory()
  if(!folderExists) {
    fs.mkdirSync(pathname)
  }
  return pathname
}