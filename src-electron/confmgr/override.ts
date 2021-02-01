import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import isDev from 'electron-is-dev'
import { AllConfig } from './subject'
import { appName } from '../constants/name'

const overrideConfigFile = 'override-config.json'

const appData = app.getPath('appData')
export const defaultDataPath = path.join(appData, appName)

const rootPath = path.join(app.getAppPath(), isDev ? '..' : '../..')

function readOverride(path: string) {
  try {
    const content = fs.readFileSync(path, { encoding: 'utf-8' })
    const result = JSON.parse(content) as Partial<AllConfig>
    return result
  } catch {
    return {}
  }
}

export const globalOverride = readOverride(path.join(rootPath, overrideConfigFile))
export const userOverride = readOverride(path.join(defaultDataPath, overrideConfigFile))

export function getOverrideValue(configKey: keyof AllConfig) {
  let result: string | undefined

  if(configKey as keyof AllConfig in globalOverride) {
    result = globalOverride[configKey]
  }

  if(configKey as keyof AllConfig in userOverride) {
    result = userOverride[configKey]
  }

  return result
}