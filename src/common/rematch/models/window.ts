import { createModel } from '@rematch/core'
import { RootModel } from './index'

import { Platforms } from '../../constants/os'

export const appWindow = createModel<RootModel>()({
  state: {
    platform: Platforms.LINUX,
    maximized: false,
    focused: true
  } as windowState,
  reducers: {
      setInitialState(state: windowState, payload: windowState) {
        return {
          ...state,
          ...payload
        }
      },
      setMaximizeState(state: windowState, payload: boolean) {
        return {
          ...state,
          maximized: payload
        }
      },
      setFocusState(state: windowState, payload: boolean) {
        return {
          ...state,
          focused: payload
        }
      }
  },
  effects: (dispatch: any) => ({
    async maximize() {
      window.electron.appWindow.maximize()
      dispatch.appWindow.setMaximizeState(true)
    },
    async minimize() {
      window.electron.appWindow.minimize()
    },
    async close() {
      window.electron.appWindow.close()
    },
    async restore() {
      window.electron.appWindow.restore()
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
  maximized?: boolean,
  focused?: boolean
}