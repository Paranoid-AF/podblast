import { createModel } from '@rematch/core'
import { message } from 'antd'
import { InvokeContent } from '../../../react-app-env'
import { RootModel } from './index'
import type { Extension } from '../../../../src-electron/data/entity/Extension'
import type { FormItem, SourceResult } from '../../../../src-electron/extensions/child-process'

const initState = {
  loaded: false,
  extensionList: [] as Array<ExtensionInfo>,
  sourceList: [] as Array<SourceInfo>
}

export const extension = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
      toggleLoaded(state: typeof initState, payload: {
        state: boolean,
        extensionList?: Array<ExtensionInfo>,
        sourceList?: Array<SourceInfo>
      }) {
        return {
          ...state,
          loaded: payload.state,
          extensionList: payload.extensionList ?? state.extensionList,
          sourceList: payload.sourceList ?? state.sourceList
        }
      },
      setExtensionList(state: typeof initState, payload: Array<ExtensionInfo>) {
        return {
          ...state,
          extensionList: payload
        }
      },
      setSourceList(state: typeof initState, payload: Array<SourceInfo>) {
        return {
          ...state,
          sourceList: payload
        }
      }
  },
  effects: (dispatch: any) => ({
    async removeExtension (extensionId: string) {
      const result = await window.electron.invoke('extension', {
        action: 'removeExtension',
        payload: extensionId
      } as InvokeContent)
      if(result.status === 'error') {
        message.error(result.info)
      }
      if(result.status === 'success') {
        message.success(result.info)
      }
    },
    async enableExtension (extensionId: string) {
      await window.electron.invoke('extension', {
        action: 'enableExtension',
        payload: extensionId
      })
    },
    async disableExtension (extensionId: string) {
      await window.electron.invoke('extension', {
        action: 'disableExtension',
        payload: extensionId
      })
    },
    async getSourceForm (payload: { sourceId: string, provider?: string }) {
      const result = (await window.electron.invoke('extension', { action: 'getSourceForm', payload: { id: payload.sourceId, provider: payload.provider } }))
      if(result.status === 'success') {
        return (result.data as Array<FormItem>)
      } else {
        throw new Error(result.info ?? 'Unknown error.')
      }
    },
    async submitSourceForm (payload: { sourceId: string, formContent: Record<string, any>, provider?: string }) {
      const result = (await window.electron.invoke('extension', { action: 'submitSourceForm', payload: { id: payload.sourceId, content: payload.formContent, provider: payload.provider } }))
      if(result.status === 'success') {
        return (result.data as SourceResult)
      } else {
        throw new Error(result.info ?? 'Unknown error.')
      }
    }
  })
})

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
  file: string,
  description?: string,
  author?: string,
  homepage?: string,
  icon?: string,
  type: 'INTERNAL' | 'EXTERNAL',
  entry: string,
  config: Extension
}

export interface SourceInfo {
  id: string,
  name: string,
  version: string,
  provider: string,
  description?: string,
  icon?: string
}
