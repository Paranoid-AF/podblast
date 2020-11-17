import { createModel } from '@rematch/core'
import { RootModel } from './index'

import { Platforms } from '../../constants/os'

export const appWindow = createModel<RootModel>()({
  state: {
    platform: Platforms.LINUX,
    maximized: false,
  } as windowState,
  reducers: {
      setInitialState(state: any, payload: windowState) {
        return {
          ...state,
          ...payload
        }
      },
      setMaximizeState(state: any, payload: boolean) {
        return {
          ...state,
          maximized: payload
        }
      }
  },
  effects: (dispatch: any) => ({
    async maximize() {
      window.electron.appWindow.maximize()
      dispatch.appWindow.setMaximizeState(true)
    },
    async init(initState: windowState) {
      dispatch.appWindow.setInitialState({
        platform: initState.platform,
        maximized: initState.maximized
      })
    }
  })
})

export interface windowState {
  platform?: Platforms,
  maximized?: boolean
}