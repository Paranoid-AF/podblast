import { extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage } from '../../../windows/main'

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }
  extensionProcess.on('message', (msg: ExtensionMessage) => {
    if(msg && msg.type === 'popup') {
      sendPopupMessage(msg.action)
    }
  })
}

export interface ExtensionMessage {
  type: 'popup',
  action: PopupMessage
}

export default registerEvents