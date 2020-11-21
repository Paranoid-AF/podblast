import path from 'path'
import fs from 'fs'
import { runInVM } from './runner'

export const extensions: Array<ExtensionInfo> = []
export const sources: Array<SourceInfo> = []

let extensionCount = -1
let extensionLoaded = 0

const checkExtension = () => {
  if(extensionCount > 0 && extensionLoaded >= extensionCount) {
    // TODO
    console.log(`Loaded ${extensions.length} extension(s), with ${sources.length} source(s).`)
  }
}

export const loadExtensions = () => {
  const extensionDirPath = path.join(process.cwd(), '/extensions')
  let fileList: Array<string> = []
  try {
    fileList = fs.readdirSync(extensionDirPath)
    extensionCount = fileList.length
  } catch (e) {
    // TODO
    console.error('Unable to read extension directory.')
  }
  
  fileList.forEach((val) => {
    const extensionPath = path.join(extensionDirPath, val)
    fs.readFile(extensionPath, { encoding: 'utf8' }, (err, data) => {
      extensionLoaded++
      if(err) {
        // TODO
        console.error('Unable to read extension file: ' + extensionPath)
      }
      runInVM(data)
      checkExtension()
    })
  })
}

loadExtensions()

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
}

export interface SourceInfo {
  id: string,
  name: string,
  version: string,
  preForm: () => Promise<Array<FormItem>>,
  postForm: (data: Record<string, any>) => string, // Key is form item ID, while value is value.
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