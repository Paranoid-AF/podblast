import { createModel } from '@rematch/core'
import { InvokeAction } from '../../../react-app-env'
import { RootModel } from './index'
import type {
  PayloadSaveSubscription,
  PayloadListSubscription,
} from '../../../../src-electron/ipc-main/handles/subscription'

const initState = {
  list: [] as Array<PayloadSaveSubscription>,
  total: Number.MAX_VALUE
}

let currentPage = 1
const itemsPerPage = 10

export const subscription = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
    appendList(state: typeof initState, payload: {
      list: typeof initState['list'],
      total: typeof initState['total'],
    }) {
      return {
        ...state,
        list: [
          ...state.list,
          ...payload.list
        ],
        total: payload.total
      }
    }
  },
  effects: (dispatch: any) => ({
    async fetchMore() {
      const result = await window.electron.invoke('subscription', {
        type: 'list',
        payload: {
          amount: itemsPerPage,
          page: currentPage++
        } as PayloadListSubscription
      })
      if(result.status === 'success') {
        dispatch.subscription.appendList({
          list: result.data.list,
          total: result.data.total
        })
      } else {
        throw new Error(result.info)
      }
    }
  })
})
