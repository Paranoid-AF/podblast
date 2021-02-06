import { createModel } from '@rematch/core'
import { RootModel } from './index'

const initState = {
  playerVisible: false
}

export const player = createModel<RootModel>()({
  state: {
    ...initState
  },
  reducers: {
    playerVisibilityChange(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playerVisible: payload
      }
    }
  }
})
