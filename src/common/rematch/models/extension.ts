import { createModel } from '@rematch/core'
import { RootModel } from './index'

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
    
  })
})

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
  version: string,
  provider: string,
  description?: string
}

export interface ExtensionState {
  loaded: boolean,
  extensionList: Array<ExtensionInfo>,
  sourceList: Array<SourceInfo>
}