import { createModel } from '@rematch/core'
import { InvokeAction } from '../../../react-app-env'
import { RootModel } from './index'

import type {
  Subscription,
} from '../../../../src-electron/data/entity/Subscription'

const initState = {
  config: {
    data: {} as Record<string, any>,
    override: [] as Array<string>
  },
  tabs: {
    pinned: [] as Array<Subscription>,
    regular: [] as Array<Subscription>
  },
  tabIds: new Set<string>()
}

export const app = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
    refreshConfig(state: typeof initState, payload: typeof initState['config']) {
      return {
        ...state,
        config: payload
      }
    },
    loadPinnedTabs(state: typeof initState, payload: typeof initState['tabs']['pinned']) {
      payload.forEach(item => {
        state.tabIds.add(item.uuid)
      })
      return {
        ...state,
        tabs: {
          ...state.tabs,
          pinned: payload
        }
      }
    },
    insertTab(state: typeof initState, { type, item } : { type: keyof typeof initState['tabs'],  item: Subscription}) {
      if(state.tabIds.has(item.uuid)) {
        return {
          ...state
        }
      }
      state.tabIds.add(item.uuid)
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [type]: [
            ...state.tabs[type],
            item
          ]
        }
      }
    },
    removeTab(state: typeof initState, { type, uuid } : { type: keyof typeof initState['tabs'],  uuid: Subscription['uuid']}) {
      const result = [...state.tabs[type]]
      const targetIndex = result.findIndex(item => (item.uuid === uuid))
      state.tabIds.delete(uuid)
      if(targetIndex >= 0) {
        result.splice(targetIndex, 1)
        return {
          ...state,
          tabs: {
            ...state.tabs,
            [type]: result
          }
        }
      }
      return state
    },
    swapTabs(state: typeof initState, { type, uuidFrom, uuidTo } : { type: keyof typeof initState['tabs'],  uuidFrom: Subscription['uuid'], uuidTo: Subscription['uuid']}) {
      const result = [...state.tabs[type]]
      const targetFrom = result.findIndex(item => (item.uuid === uuidFrom))
      const targetTo = result.findIndex(item => (item.uuid === uuidTo))
      if(targetFrom >= 0 && targetTo >= 0) {
        const temp = result[targetFrom]
        result.splice(targetFrom, 1)
        result.splice(targetTo, 0, temp)
        return {
          ...state,
          tabs: {
            ...state.tabs,
            [type]: result
          }
        }
      }
      return {
        ...state
      }
    },
    changeTabPinState(state: typeof initState, payload: { uuid: string, state: boolean }) {
      const tabPinned = [...state.tabs.pinned]
      const tabRegular = [...state.tabs.regular]
      if(payload.state) {
        const targetIndex = tabRegular.findIndex(item => item.uuid === payload.uuid)
        if(targetIndex >= 0) {
          const temp = tabRegular[targetIndex]
          tabRegular.splice(targetIndex, 1)
          tabPinned.push(temp)
        }
      } else {
        const targetIndex = tabPinned.findIndex(item => item.uuid === payload.uuid)
        tabPinned.splice(targetIndex, 1)
        state.tabIds.delete(payload.uuid)
      }
      return {
        ...state,
        tabs: {
          regular: tabRegular,
          pinned: tabPinned
        }
      }
    }
  },
  effects: (dispatch: any) => ({
    async setConfig(target: { key: string, value: any }) {
      await window.electron.invoke('confmgr', {
        type: 'setConfig',
        payload: {
          key: target.key,
          value: target.value
        } as any
      } as InvokeAction)
    }
  })
})
