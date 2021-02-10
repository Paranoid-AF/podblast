import { createModel } from '@rematch/core'
import { RootModel } from './index'

const initState = {
  playerVisible: false,
  showNowPlaying: false,
  playing: {
    url: "ww",
    cover: "https://is4-ssl.mzstatic.com/image/thumb/Podcasts124/v4/02/b0/58/02b0588c-242f-c403-1877-2ec3ac9c91bd/mza_17810596149436768499.png/400x400bb.jpg"
  }
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
    },
    toggleNowPlaying(state: typeof initState, payload: boolean) {
      return {
        ...state,
        showNowPlaying: payload
      }
    }
  }
})
