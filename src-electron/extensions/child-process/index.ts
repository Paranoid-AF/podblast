import path from 'path'
import fs from 'fs'
import './listener'
import { runInVM } from './runner'
import type { PopupMessage } from '../../windows/main'
import type { ExtensionMessage } from '../'

export const extensions: Array<ExtensionInfo> = []
export const sources: Array<SourceInfo> = []

let extensionCount = -1
let extensionLoaded = 0

const checkExtension = () => {
  if(extensionCount >= 0 && extensionLoaded >= extensionCount) {
    if(process.send) {
      process.send({
        type: 'extensionReady'
      } as ExtensionMessage)
    }
  }
}

export const loadExtensions = () => {
  const extensionDirPath = path.join(process.cwd(), '/extensions')
  let fileList: Array<string> = []
  try {
    fileList = fs.readdirSync(extensionDirPath)
    extensionCount = fileList.length
  } catch (e) {
    if(process.send) {
      process.send({
        type: 'popup',
        action: {
          icon: 'error',
          content: 'Unable to read extension directory.'
        } as PopupMessage
      } as ExtensionMessage)
    }
  }
  
  checkExtension()

  fileList.forEach((val) => {
    const extensionPath = path.join(extensionDirPath, val)
    fs.readFile(extensionPath, { encoding: 'utf8' }, (err, data) => {
      extensionLoaded++
      if(err) {
        if(process.send) {
          process.send({
            type: 'popup',
            action: {
              icon: 'error',
              content: 'Unable to read extension file: ' + extensionPath
            } as PopupMessage
          } as ExtensionMessage)
        }
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
  description?: string,
  author?: string,
  homepage?: string
}

export interface SourceInfo {
  id: string,
  name: string,
  description?: string,
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