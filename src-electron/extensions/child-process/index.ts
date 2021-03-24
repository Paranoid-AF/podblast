import path from 'path'
import fs from 'fs'
import { updateExtensionList, updateSourceList } from './listener'
import { runInVM } from './runner'
import type { PopupMessage, NotificationMessage } from '../../windows/main'

import { sender } from './ipc'
import type { Extension } from '../../data/entity/Extension'

export const extensions: Array<ExtensionInfo> = []
export const sources: Array<SourceInfo> = []

const [ send, disband ] = sender

export const readIconFile = (filePath: string) => {
  const base64Result = fs.readFileSync(filePath).toString('base64')
  const fileNameSegs = filePath.split('.')
  const fileExtensionName = fileNameSegs[fileNameSegs.length - 1]
  return 'data:image/' + fileExtensionName +';base64,' + base64Result
}

const extensionReady = () => {
  send('extensionReady', [extensions, sources])
}

export const getExtensionMeta = async (packagePath: string, type: ExtensionType) => {
  const packageJsonPath = path.join(packagePath, './package.json')
  let packageJsonRaw = ''
  try {
    packageJsonRaw = fs.readFileSync(packageJsonPath, { encoding: 'utf8' })
  } catch (e) {
    throw new Error("No meta data file detected.")
  }
  const packageJson = JSON.parse(packageJsonRaw)
  let extensionConfig = (await send('getExtensionInfo', packageJson['name'])) as Extension
  const extensionMeta: ExtensionInfo = {
    id: packageJson['name'],
    name: packageJson['displayName'] || packageJson['name'],
    version: packageJson['version'],
    file: packagePath,
    entry: packageJson['main'] || 'index.js',
    config: extensionConfig,
    type
  }
  for(let key in extensionMeta) {
    if(typeof extensionMeta[key as keyof typeof extensionMeta] === 'undefined') {
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
  if(packageJson['icon']) {
    extensionMeta.icon = readIconFile(path.join(packagePath, packageJson['icon']))
  }
  return extensionMeta
}

export const listExtensions = (extensionDirPath: string) => {
  let fileList: Array<string> = []
  try {
    fileList = fs.readdirSync(extensionDirPath)
    fileList = fileList.filter((packageName) => {
      // Check if the directory is a valid extension directory.
      const dirPath = path.join(extensionDirPath, './' + packageName)
      const isDirectory = fs.lstatSync(dirPath).isDirectory()
      const hasMetaData = fs.existsSync(path.join(dirPath, './package.json'))
      return isDirectory && hasMetaData
    })
    // Provide full path.
    fileList.forEach((packageName, index, arr) => {
      arr[index] = path.join(extensionDirPath, './' + packageName)
    })
  } catch (e) {
    send('notification', {
      title: 'Extension Error',
      content: 'Unable to read extension directory: ' + extensionDirPath
    } as NotificationMessage)
    console.error(e)
  }
  return fileList
}

export const loadExtension = async (packagePath: string, type: ExtensionType) => {
  try {
    const extensionInfo = await getExtensionMeta(packagePath, type)
    const extensionIndex = extensions.findIndex(val => val.id === extensionInfo.id)
    if(extensionIndex < 0) {
      extensions.push(extensionInfo)
    } else {
      extensions[extensionIndex] = extensionInfo
    }
    updateExtensionList()
    if(extensionInfo.config.status === 'disabled') {
      return
    }
    const extensionEntry = path.join(packagePath, './' + extensionInfo.entry)
    runInVM(extensionEntry, extensionInfo)
    updateSourceList()
  } catch (e) {
    send('notification', {
      title: 'Extension Error',
      content: 'Unable to load extension: ' +  path.basename(packagePath)
    } as NotificationMessage)
    console.error(e)
  }
}

export const unloadExtension = (extensionId: string, removeFromList: boolean = true) => {
  for(let i=0; i<sources.length; i++) {
    if(i >= sources.length) {
      break
    }
    if(sources[i].provider === extensionId) {
      sources.splice(i, 1)
      i--
    }
  }
  if(removeFromList) {
    for(let i=0; i<extensions.length; i++) {
      if(i >= extensions.length) {
        break
      }
      if(extensions[i].id === extensionId) {
        extensions.splice(i, 1)
        i--
      }
    }
  } else {
    const original = extensions.find(val => val.id === extensionId)
    if(typeof original !== 'undefined') {
      original.config.status = 'disabled'
    }
  }
  updateSourceList()
  updateExtensionList()
}

const externalExtensionPath = process.env.extPath ?? path.join(process.cwd(), './extensions')
const internalExtensionPath = path.join(__dirname, '../../assets/extensions')

const externalExtensionNames = listExtensions(externalExtensionPath)
const internalExtensionNames = listExtensions(internalExtensionPath)

const extensionList: Array<{
  name: string,
  type: ExtensionType
}> = [
  ...externalExtensionNames.map(val => {
    return {
      name: val,
      type: 'EXTERNAL' as ExtensionType
    }
  }),
  ...internalExtensionNames.map(val => {
    return {
      name: val,
      type: 'INTERNAL' as ExtensionType
    }
  })
]

if(extensionList.length === 0) {
  extensionReady()
}

extensionList.forEach((packageInfo, index, arr) => {
  loadExtension(
    packageInfo.name,
    packageInfo.type
  ).then(() => {
    if(arr.length - 1 <= index) {
      updateSourceList()
      extensionReady()
    }
  })
})

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
  file: string,
  entry: string,
  description?: string,
  author?: string,
  homepage?: string,
  type: 'INTERNAL' | 'EXTERNAL',
  icon?: string,
  config: Extension
}

export interface SourceInfo {
  id: string,
  name: string,
  description?: string,
  preForm: () => Promise<Array<FormItem>>,
  postForm: (data: Record<string, any>) => Promise<SourceResult>, // Key is form item ID, while value is value. Returns a token to fetch content.
  fetch: (key: string, page: number) => Promise<unknown>,
  provider: string,
  icon?: string
}

interface FormField {
  description: string, // Name for display.
  value: any // Actual values that's passed
  isDefault?: boolean
}

export interface FormItem {
  id: string,
  name: string,
  type: 'SELECT' | 'INPUT' | 'RADIO' | 'CHECK',
  placeholder?: string, // Only available when type is INPUT
  defaultValue?: string, // Only available when type is INPUT
  optional?: boolean, // Required by default
  field?: Array<FormField> // Field could be undefined when type is INPUT
}

export interface SourceResult {
  name: string,
  icon?: string, // Base64
  key: string
}

type ExtensionType = 'INTERNAL' | 'EXTERNAL'