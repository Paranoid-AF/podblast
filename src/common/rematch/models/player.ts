import { createModel } from '@rematch/core'
import { RootModel } from './index'

const initState = {
  playerVisible: false,
  showNowPlaying: false,
  playing: {
    url: "ww",
    title: "62. 你的电脑不是你的",
    channel: "内核恐慌",
    seekCurrent: 1762,
    seekTotal: 7130,
    seekLoaded: 6216,
    cover: "https://assets.fireside.fm/file/fireside-images/podcasts/images/b/bcdeb9eb-7a8c-4a76-a424-1023c5d280b0/cover_small.jpg?v=3"
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
