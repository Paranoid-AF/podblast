import { createModel } from '@rematch/core'
import { store } from '..'
import { RootModel } from './index'

const initState = {
  playerVisible: false,
  showNowPlaying: false,
  playing: {
    ready: false,
    url: "",
    paused: false,
    title: "",
    channel: "",
    seekCurrent: 0,
    seekTotal: 0,
    seekLoaded: 0,
    nowPlayingPage: "",
    cover: "",
    muted: false,
    buffering: false
  },
  ignoreProgress: false
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
    setBuffering(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          buffering: payload
        }
      }
    },
    toggleNowPlaying(state: typeof initState, payload: boolean) {
      return {
        ...state,
        showNowPlaying: payload
      }
    },
    setReady(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          buffering: false
        }
      }
    },
    setDuration(state: typeof initState, payload: number) {
      return {
        ...state,
        playing: {
          ...state.playing,
          seekTotal: payload
        }
      }
    },
    setProgress(state: typeof initState, payload: { played: number, loaded?: number }) {
      let result: Partial<(typeof state)['playing']> = {}
      if(typeof payload.loaded !== 'undefined') {
        result = {
          seekLoaded: payload.loaded,
          seekCurrent: payload.played
        }
      } else {
        result = {
          seekCurrent: payload.played
        }
      }
      return {
        ...state,
        playing: {
          ...state.playing,
          ...result
        }
      }
    },
    setSeekTo(state: typeof initState, payload: number) {
      let target = payload
      if(target < 0) {
        target = 0
      }
      if(target > state.playing.seekTotal) {
        target = state.playing.seekTotal
      }
      seekTo_Debounced(target)
      return {
        ...state,
        playing: {
          ...state.playing,
          seekCurrent: target
        },
        ignoreProgress: true
      }
    },
    setIgnorance(state: typeof initState, payload: boolean) {
      return {
        ...state,
        ignoreProgress: payload
      }
    },
    setUrl(state: typeof initState, payload: string) {
      return {
        ...state,
        playing: {
          ...state.playing,
          url: payload
        }
      }
    },
    setPaused(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          paused: payload
        }
      }
    },
    setMuted(state: typeof initState, payload: boolean) {
      return {
        ...state,
        playing: {
          ...state.playing,
          muted: payload
        }
      }
    },
    resetPlayer(state: typeof initState, payload: Partial<typeof initState['playing']>) {
      const originalPlaying = initState.playing
      const resetContent: Partial<typeof initState['playing']> = {
        buffering: originalPlaying.buffering,
        url: originalPlaying.url,
        title: originalPlaying.title,
        channel: originalPlaying.channel,
        seekCurrent: originalPlaying.seekCurrent,
        seekTotal: originalPlaying.seekTotal,
        seekLoaded: originalPlaying.seekLoaded,
        nowPlayingPage: originalPlaying.nowPlayingPage,
        cover: originalPlaying.cover,
      }
      return {
        ...state,
        playing: {
          ...state.playing,
          ...resetContent,
          ...payload
        }
      }
    }
  },
  effects: (dispatch: any) => ({
    async togglePIP(payload: boolean) {
      window.electron.invoke('player', {
        action: 'togglePlayerWindow', payload: payload
      })
    },
    async seekTo(target: number) {
      dispatch.player.setSeekTo(target)
    },
    async startPlaying(payload: { url: string, nowPlayingPage: string, coverArt: string, title: string, channel: string }) {
      const allState = store.getState()
      const volume = allState.app.config.data['player.volume']
      const playbackSpeed = allState.app.config.data['player.playbackSpeed']
      dispatch.player.resetPlayer({
        ready: true,
        buffering: true,
        url: payload.url,
        nowPlayingPage: payload.nowPlayingPage,
        cover: payload.coverArt,
        title: payload.title,
        channel: payload.channel
      })
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          url: payload.url,
          playing: true,
          volume: volume,
          playbackRate: playbackSpeed
        }
      })
      dispatch.player.setPaused(false)
      dispatch.player.setUrl(payload.url)
    },
    async togglePause(paused: boolean) {
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          playing: !paused
        }
      })
      dispatch.player.setPaused(paused)
    },
    async setVolume(value: number) {
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          volume: value
        }
      })
    },
    async toggleMuted(value: boolean) {
      dispatch.player.setMuted(value)
      await window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          muted: value
        }
      })
    },
    async changePlaybackSpeed(value: number) {
      window.electron.invoke('player', {
        action: 'setParams',
        payload: {
          playbackRate: value
        }
      })
      store.dispatch.app.setConfig({
        key: 'player.playbackSpeed',
        value: value
      })
    },
    async setUpProxy(extensionName: string) {
      await window.electron.invoke('player', {
        action: 'setProxy',
        payload: {
          extensionName
        }
      })
    },
    async setUpUserAgent(userAgent: string) {
      await window.electron.invoke('player', {
        action: 'setUserAgent',
        payload: userAgent
      })
    }
  })
})

let timer_seekTo: NodeJS.Timeout | null = null
function seekTo_Debounced(timeBySec: number) {
  if(timer_seekTo !== null) {
    clearTimeout(timer_seekTo)
    timer_seekTo = null
  }
  timer_seekTo = setTimeout(() => {
    window.electron.invoke('player', {
      action: 'seekTo',
      payload: timeBySec
    })
  }, 300)
}