import { message, notification } from 'antd'
import type { MessageType } from 'antd/lib/message'
import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events["popup"] = (event, info) => {
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

events["notification"] = (event, info) => {
  notification.open({
    message: info.title ?? '提示',
    description: info.content ?? '',
    duration: info.duration ?? 0
  })
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