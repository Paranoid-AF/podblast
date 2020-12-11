/* eslint-disable no-throw-literal */
import { sources, extensions, SourceInfo } from './'
import { resolver as resolverInit, sender as senderInit } from 'ipc-promise-invoke'

const resolver = resolverInit(process)
const sender = senderInit(process)

resolver.addChannel('getExtensionList', () => {
  updateExtensionList()
})

resolver.addChannel('getSourceList', () => {
  updateSourceList()
})

resolver.addChannel('getForm', async (payload: {id: string, provider?: string}) => {
  let targetSource = findSource(payload.id, payload.provider)
  if(targetSource) {
    try {
      return await Promise.resolve(targetSource.preForm())
    } catch(e) {
      let error = e
      if(typeof e === 'object' && Object.keys(e).length === 0) {
        error = 'preForm not found in source, or the extension has uncaught internal error.'
      }
      throw {
        type: 'EXTENSION_ERROR',
        info: error
      } as ListenerError
    }
  } else {
    throw {
      type: 'NOT_FOUND',
      info: 'No such source.'
    } as ListenerError
  }
})

resolver.addChannel('submitForm', async (payload: {id: string, provider?: string, data: Record<string, any>}) => {
  let targetSource = findSource(payload.id, payload.provider)
  if(targetSource) {
    try {
      return await Promise.resolve(targetSource.postForm(payload.data))
    } catch(e) {
      let error = e
      if(typeof e === 'object' && Object.keys(e).length === 0) {
        error = 'postForm not found in source, or the extension has uncaught internal error.'
      }
      throw {
        type: 'EXTENSION_ERROR',
        info: error
      } as ListenerError
    }
  } else {
    throw {
      type: 'NOT_FOUND',
      info: 'No such source.'
    } as ListenerError
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
  sender('extensionList', extensions)
}

export const updateSourceList = () => {
  sender('sourceList', sources.map((val) => {
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