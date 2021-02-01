import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events['config_update'] = (event, payload) => {
  const result = JSON.parse(payload)
  store.dispatch.app.refreshConfig(result)
}

export default events