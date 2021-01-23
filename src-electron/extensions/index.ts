import { app } from 'electron'
import path from 'path'
import child_process, { ChildProcess } from 'child_process'
import isDev from 'electron-is-dev'

import { buildIpcBridge, sender } from './ipc'

export let extensionProcess: ChildProcess | null = null
export let sources: Array<SourceInfo> = []
export let extensions: Array<ExtensionInfo> = []

export const startExtensionProcess = () => {
  const locale = app.getLocale()
  const appPath = path.join(app.getAppPath(), '..')
  extensionProcess = child_process.fork(path.join(__dirname, './child-process/index.js'), [], {
    env: {
      locale,
      dev: isDev.toString(),
      appPath
    } as any
  })
  buildIpcBridge()
}

export const unloadExtension = (id: string) => {
  const [ send, disband ] = sender
  send('unload', id)
}

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
  file: string,
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