import { message, notification } from 'antd'
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

export default events