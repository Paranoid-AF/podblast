import { app } from 'electron'
import path from 'path'
import child_process, { ChildProcess } from 'child_process'
import isDev from 'electron-is-dev'
export let extensionProcess: ChildProcess | null = null
export let sources: Array<SourceInfo> = []
export let extensions: Array<ExtensionInfo> = []

export const startExtensionProcess = () => {
  const locale = app.getLocale()
  extensionProcess = child_process.fork(path.join(__dirname, './child-process/index.js'), [], {
    env: {
      locale,
      dev: isDev.toString()
    }
  })
}

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
  provider: string
}

export interface ExtensionMessage {
  type: 'popup' | 'extensionReady' | 'extensionList' | 'sourceList',
  action?: any
}