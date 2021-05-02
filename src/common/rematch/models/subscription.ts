import { createModel } from '@rematch/core'
import type { SourceResult } from '../../../../src-electron/extensions/child-process'
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
    async submitSourceForm (payload: { sourceId: string, formContent: Record<string, any>, provider?: string }) {
      const result = (await window.electron.invoke('extension', {
        type: 'submitSourceForm',
        payload: {
          id: payload.sourceId,
          content: payload.formContent,
          provider: payload.provider
        }
      } as InvokeAction))
      if(result.status === 'success') {
        const sourceResult = result.data as SourceResult
        const targetUUID = await (window.electron.invoke('subscription', {
          type: 'add',
          payload: {
            ...sourceResult,
            source: payload.sourceId,
            extension: payload.provider ?? ''
          }
        } as InvokeAction))
        if(targetUUID.status === 'success') {
          return targetUUID.data
        } else {
          throw new Error(result.info ?? 'Error saving subscription.')
        }
      } else {
        throw new Error(result.info ?? 'Error saving subscription.')
      }
    },
    async fetchMore() {
      const result = await window.electron.invoke('subscription', {
        type: 'list',
        payload: {
          amount: itemsPerPage,
          page: currentPage++
        } as PayloadListSubscription
      } as InvokeAction)
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
