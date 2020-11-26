import { message } from 'antd'
import type { MessageType } from 'antd/lib/message'
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

let hideLoading: null | MessageType = null
const loadingPopup = setTimeout(() => {
  hideLoading = message.loading({ content: 'Loading extensions...', duration: 0 })
}, 500)

const unsubscribeLoading = store.subscribe(() => {
  const state = store.getState()
  if(state.extension.loaded) {
    if(hideLoading) {
      hideLoading()
    }
    clearTimeout(loadingPopup)
    unsubscribeLoading()
    window.electron.extension.updateExtensions()
    window.electron.extension.updateSources()
  }
})

export default events