import { message } from 'antd'
const events: Record<string, (...args: Array<any>) => void> = {}

events["message"] = (event, info) => {
  console.log(info)
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
export default events