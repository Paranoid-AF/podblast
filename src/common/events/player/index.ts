import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events['show_state_change'] = (event, payload: boolean) => {
  store.dispatch.player.playerVisibilityChange(payload)
}

export default events