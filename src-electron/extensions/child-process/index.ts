import path from 'path'
import fs from 'fs'
import { updateExtensionList } from './listener'
import { runInVM } from './runner'
import type { PopupMessage } from '../../windows/main'
import { sender as senderInit } from 'ipc-promise-invoke'

export const extensions: Array<ExtensionInfo> = []
export const sources: Array<SourceInfo> = []
const sender = senderInit(process)
const extensionDirPath = path.join(process.cwd(), '/extensions')

const extensionReady = () => {
  sender('extensionReady')
}

export const getExtensionMeta = (packageName: string) => {
  const packageJsonPath = path.join(process.cwd(), '/extensions/' + packageName + '/package.json')
  let packageJsonRaw = ''
  try {
    packageJsonRaw = fs.readFileSync(packageJsonPath, { encoding: 'utf8' })
  } catch (e) {
    throw new Error("No meta data file detected.")
  }
  const packageJson = JSON.parse(packageJsonRaw)
  const extensionMeta: ExtensionInfo = {
    id: packageJson['name'],
    name: packageJson['displayName'] || packageJson['name'],
    version: packageJson['version'],
    file: packageName,
    entry: packageJson['main'] || 'index.js'
  }
  for(let key in extensionMeta) {
    if(typeof extensionMeta[key as keyof typeof extensionMeta] !== 'string') {
      throw new Error("Missing required meta key: " + key)
    }
  }
  if(packageJson['author']) {
    extensionMeta.author = packageJson['author']
  }
  if(packageJson['description']) {
    extensionMeta.description = packageJson['description']
  }
  if(packageJson['homepage']) {
    extensionMeta.homepage = packageJson['homepage']
  }
  return extensionMeta
}

export const listExtensions = () => {
  let fileList: Array<string> = []
  try {
    fileList = fs.readdirSync(extensionDirPath)
    fileList = fileList.filter((val) => {
      const dirPath = path.join(process.cwd(), '/extensions/' + val)
      const isDirectory = fs.lstatSync(dirPath).isDirectory()
      const hasMetaData = fs.existsSync(dirPath + '/package.json')
      return isDirectory && hasMetaData
    })
  } catch (e) {
    sender('popup', {
      icon: 'error',
      content: 'Unable to read extension directory.'
    } as PopupMessage)
    console.error(e)
  }
  return fileList
}

export const loadExtension = (packageName: string) => {
  try {
    const extensionInfo = getExtensionMeta(packageName)
    const extensionEntry = path.join(extensionDirPath, packageName + '/' + extensionInfo.entry)
    runInVM(extensionEntry, extensionInfo)
    extensions.push(extensionInfo)
    updateExtensionList()
  } catch (e) {
    sender('popup', {
      icon: 'error',
      content: 'Unable to read extension: ' + packageName
    } as PopupMessage)
    console.error(e)
  }
}

listExtensions().forEach((packageName: string, index, arr) => {
  loadExtension(packageName)
  if(arr.length - 1 <= index) {
    extensionReady()
  }
})

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
  file: string,
  entry: string,
  description?: string,
  author?: string,
  homepage?: string
}

export interface SourceInfo {
  id: string,
  name: string,
  description?: string,
  preForm: () => Promise<Array<FormItem>>,
  postForm: (data: Record<string, any>) => string, // Key is form item ID, while value is value. Returns a token to fetch content.
  provider: string
}

interface FormField {
  description: string, // Name for display.
  value: any // Actual values that's passed
}

interface FormItem {
  id: string,
  name: string,
  type: 'SELECT' | 'INPUT' | 'RADIO' | 'CHECK',
  field?: Array<FormField> // Field could be undefined when type is INPUT
}