import { createModel } from '@rematch/core'
import { message } from 'antd'
import { InvokeContent } from '../../../react-app-env'
import { RootModel } from './index'
import type { Extension } from '../../../../src-electron/data/entity/Extension'

export const extension = createModel<RootModel>()({
  state: {
    loaded: false,
    extensionList: [],
    sourceList: []
  } as ExtensionState,
  reducers: {
      toggleLoaded(state: ExtensionState, payload: {
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
      setExtensionList(state: ExtensionState, payload: Array<ExtensionInfo>) {
        return {
          ...state,
          extensionList: payload
        }
      },
      setSourceList(state: ExtensionState, payload: Array<SourceInfo>) {
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

export interface ExtensionState {
  loaded: boolean,
  extensionList: Array<ExtensionInfo>,
  sourceList: Array<SourceInfo>
}