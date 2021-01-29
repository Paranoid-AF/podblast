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
      window.electron.invoke('appWindow', {
        action: "maximize"
      })
      dispatch.appWindow.setMaximizeState(true)
    },
    async minimize() {
      window.electron.invoke('appWindow', {
        action: "minimize"
      })
    },
    async close() {
      window.electron.invoke('appWindow', {
        action: "close"
      })
    },
    async restore() {
      window.electron.invoke('appWindow', {
        action: "restore"
      })
    },
    async init(initState: windowState) {
      dispatch.appWindow.setInitialState({
        platform: initState.platform,
        maximized: initState.maximized
      })
    },
    async openExplorer(folderPath: string) {
      await window.electron.invoke('utils', {
        action: "openExplorer",
        payload: folderPath
      })
    }
  })
})

export interface windowState {
  platform?: Platforms,
  maximized?: boolean,
  focused?: boolean
}