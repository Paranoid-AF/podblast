import type { Extension } from '../../data/entity/Extension'
import { sources, extensions, SourceInfo, unloadExtension, loadExtension } from './'
import { sender, resolver } from './ipc'

const [ addChannel, cancelChannel, disbandResolver ] = resolver
const [ send, disbandSender ] = sender

addChannel('getExtensionList', () => {
  updateExtensionList()
})

addChannel('getSourceList', () => {
  updateSourceList()
})

addChannel('getForm', async (payload: {id: string, provider?: string}) => {
  let targetSource = findSource(payload.id, payload.provider)
  if(targetSource) {
    try {
      return {
        status: 'success',
        data: await Promise.resolve(targetSource.preForm())
      }
    } catch(e) {
      let error = e
      if(typeof e === 'object' && Object.keys(e).length === 0) {
        return {
          status: 'success',
          data: null
        }
      }
      return {
        status: 'error',
        info: 'Extension Error: ' + error
      }
    }
  } else {
    return {
      status: 'error',
      info: 'No such source.'
    }
  }
})

addChannel('submitForm', async (payload: {id: string, provider?: string, data: Record<string, any>}) => {
  let targetSource = findSource(payload.id, payload.provider)
  if(targetSource) {
    try {
      return {
        status: 'success',
        data: await Promise.resolve(targetSource.postForm(payload.data))
      }
    } catch(e) {
      let error = e
      if(typeof e === 'object' && Object.keys(e).length === 0) {
        error = 'postForm not found in source, or the extension has uncaught internal error.'
      }
      return {
        status: 'error',
        info: 'Extension Error: ' + error
      }
    }
  } else {
    return {
      status: 'error',
      info: 'No such source.'
    }
  }
})

addChannel('unload', async (id: string) => {
  unloadExtension(id, true)
})

addChannel('disable', async (id: string) => {
  unloadExtension(id, false)
})

addChannel('enable', async (id: string) => {
  const info = extensions.find(val => val.id === id)
  if(typeof info !== 'undefined') {
    await loadExtension(info.file, info.type)
  }
})

addChannel('updateConfig', async (target: Partial<Extension>) => {
  if(typeof target.extensionId !== 'undefined') {
    const info = extensions.find(val => val.id === target.extensionId)
    if(typeof info?.config !== 'undefined') {
      info.config = {
        ...info.config,
        ...target
      }
      updateExtensionList()
    }
  }
})

const findSource = (id: string, provider?: string) => {
  let targetSource: SourceInfo | null = null
  for(let source of sources) {
    if(source.id === id && (!provider || provider === source.provider)) {
      targetSource = source
      break
    }
  }
  return targetSource
}

export const updateExtensionList = () => {
  send('extensionList', extensions)
}

export const updateSourceList = () => {
  send('sourceList', sources.map((val) => {
    const properties: Record<string, any> = { }
    for(let key in val) {
      if(typeof val[key as keyof typeof val] !== 'function') {
        properties[key] = val[key as keyof typeof val]
      }
    }
    return properties
  }))
}

export interface ListenerError {
  type: 'NOT_FOUND' | 'EXTENSION_ERROR',
  info: string
}