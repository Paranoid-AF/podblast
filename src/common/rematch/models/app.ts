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
  }
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
      return {
        ...state,
        tabs: {
          ...state.tabs,
          pinned: payload
        }
      }
    },
    insertTab(state: typeof initState, { type, item } : { type: keyof typeof initState['tabs'],  item: Subscription}) {
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
