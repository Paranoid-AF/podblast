import { extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage } from '../../../windows/main'

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }
  extensionProcess.on('message', (msg: PopupMessage) => {
    if(msg && msg.icon && msg.content) {
      sendPopupMessage(msg)
    }
  })
}



export default registerEvents