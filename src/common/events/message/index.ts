import { message } from 'antd'
import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events["message"] = (event, info) => {
  switch(info.icon) {
    case 'normal':
      message.info(info.content)
      break
    case 'error':
      message.error(info.content)
      break
    case 'success':
      message.success(info.content)
      break
    case 'warning':
      message.warning(info.content)
      break
    default:
      message.info(info.content)
      break
  }
}

const hideLoading = message.loading({ content: 'Loading extensions...', duration: 0 })
const unsubscribeLoading = store.subscribe(() => {
  const state = store.getState()
  if(state.extension.loaded) {
    hideLoading()
    unsubscribeLoading()
    window.electron.extension.updateExtensions()
    window.electron.extension.updateSources()
  }
})

export default events