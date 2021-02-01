import { createModel } from '@rematch/core'
import { message } from 'antd'
import { InvokeContent } from '../../../react-app-env'
import { RootModel } from './index'

export const app = createModel<RootModel>()({
  state: {
    config: {
      data: {},
      override: []
    }
  } as AppState,
  reducers: {
    refreshConfig(state: AppState, payload: Config) {
      return {
        ...state,
        config: payload
      }
    }
  },
  effects: (dispatch: any) => ({
    async setConfig(key: string, value: any) {
      await window.electron.invoke('confmgr', {
        action: 'setConfig',
        payload: {
          key,
          value
        } as any
      } as InvokeContent)
    }
  })
})

interface Config {
  data: Record<string, any>,
  override: Array<string>
}

export interface AppState {
  config: Config
}