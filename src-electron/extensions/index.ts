import { app, shell } from 'electron'
import path from 'path'
import child_process, { ChildProcess } from 'child_process'
import isDev from 'electron-is-dev'

import { connection } from '../data'
import { Extension } from '../data/entity/Extension'
import { extensionPath } from '../constants/path'
import { buildIpcBridge, sender } from './ipc'
import { cachedLists } from '../ipc-main/events/extension'
import { rmdirSync } from 'fs'

export let extensionProcess: ChildProcess | null = null
export let sources: Array<SourceInfo> = []
export let extensions: Array<ExtensionInfo> = []


export const startExtensionProcess = () => {
  const locale = app.getLocale()
  const extPath = extensionPath
  extensionProcess = child_process.fork(path.join(__dirname, './child-process/index.js'), [], {
    env: {
      locale,
      dev: isDev.toString(),
      extPath
    } as any
  })
  buildIpcBridge()
}


const unloadExtension = async (id: string) => {
  const [ send, disband ] = sender
  await send('unload', id)
}

const toggleExtensionConfig = async (id: string, target: Partial<Extension>) => {
  if(!connection.current) {
    return
  }
  await connection.current
          .createQueryBuilder()
          .update(Extension)
          .set(target)
          .where(
            "extensionId = :id", { id }
          )
          .execute()
}

export const disableExtension = async (id: string) => {
  await toggleExtensionConfig(id, { status: 'disabled' })
  const [ send, disband ] = sender
  await send('disable', id)
}

export const enableExtension = async (id: string) => {
  await toggleExtensionConfig(id, { status: 'enabled' })
  const [ send, disband ] = sender
  await send('enable', id)
}

export const updateExtensionConfig = async (id: string, target: Partial<Extension>) => {
  await toggleExtensionConfig(id, target)
  const [ send, disband ] = sender
  await send('updateConfig', {
    ...target,
    extensionId: id
  } as Partial<Extension>)
}

export const removeExtension = async (id: string) => {
  let extensionInfo = (cachedLists[0] as Array<ExtensionInfo>).find(val => val.id === id)
  if(extensionInfo) {
    const filePath = extensionInfo.file
    const removalStatus = shell.moveItemToTrash(filePath, false)
    if(removalStatus) {
      unloadExtension(id)
      return {
        status: 'success',
        info: 'Successfully moved extension files to trash.'
      }
    } else {
      try {
        rmdirSync(filePath)
      } catch (error) {
        console.error(error)
        return {
          status: 'error',
          info: 'Unable to delete files.'
        }
      }
      unloadExtension(id)
      return {
        status: 'success',
        info: 'Successfully removed extension files.'
      }
    }
  } else {
    return {
      status: 'error',
      info: 'Extension not found.'
    }
  }
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