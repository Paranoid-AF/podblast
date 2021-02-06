import { createModel } from '@rematch/core'
import { RootModel } from './index'

import { Platforms } from '../../constants/os'

const initState = {
  platform: Platforms.LINUX as Platforms,
  maximized: false,
  focused: true
}

export const appWindow = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
      setInitialState(state: typeof initState, payload: typeof initState) {
        return {
          ...state,
          ...payload
        }
      },
      setMaximizeState(state: typeof initState, payload: boolean) {
        return {
          ...state,
          maximized: payload
        }
      },
      setFocusState(state: typeof initState, payload: boolean) {
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
    async init(payload: typeof initState) {
      dispatch.appWindow.setInitialState({
        ...initState,
        ...payload
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
