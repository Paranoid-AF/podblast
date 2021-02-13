import { createModel } from '@rematch/core'
import { InvokeContent } from '../../../react-app-env'
import { RootModel } from './index'

const initState = {
  config: {
    data: {} as Record<string, any>,
    override: [] as Array<string>
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
    }
  },
  effects: (dispatch: any) => ({
    async setConfig(target: { key: string, value: any }) {
      console.log(target)
      await window.electron.invoke('confmgr', {
        action: 'setConfig',
        payload: {
          key: target.key,
          value: target.value
        } as any
      } as InvokeContent)
    }
  })
})
