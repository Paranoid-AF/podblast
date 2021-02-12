import { store } from '../../rematch'
import { EventTypes } from '../../constants/enum'
import { message } from 'antd'
const events: Record<string, (...args: Array<any>) => void> = {}

events['show_state_change'] = (event, payload: boolean) => {
  store.dispatch.player.playerVisibilityChange(payload)
}

events['player_event'] = (event, payload: PlayerEvent) => {
  switch(payload.type) {
    case EventTypes.ON_READY:
      store.dispatch.player.setReady(true)
      break
    case EventTypes.ON_DURATION:
      if(typeof payload.payload === 'number') {
        store.dispatch.player.setDuration(payload.payload)
      }
      break
    case EventTypes.ON_SEEK:
      if(typeof payload.payload === 'number') {
        store.dispatch.player.setProgress({
          played: payload.payload
        })
      }
      break
    case EventTypes.ON_PROGRESS:
      const shouldIgnore = store.getState()['player']['ignoreProgress']
      if(shouldIgnore) {
        store.dispatch.player.setIgnorance(false)
        return
      }
      if(typeof payload.payload === 'object') {
        store.dispatch.player.setProgress({
          loaded: payload.payload['loadedSeconds'],
          played: payload.payload['playedSeconds']
        })
      }
      break
    case EventTypes.ON_PAUSE:
      store.dispatch.player.setPaused(true)
      break
    case EventTypes.ON_PLAY:
      store.dispatch.player.setPaused(false)
      break
    case EventTypes.ON_ENDED:
      // TODO: Play next episode in playlist.
      break
    case EventTypes.ON_ERROR:
      message.error('Failed to load media source.')
      break
  }
}

interface PlayerEvent {
  type: EventTypes,
  payload: Record<string, any> | number
}

export default events