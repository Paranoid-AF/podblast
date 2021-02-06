import playerWindow from '../../../windows/player'
import { sendMessage } from '../common'

const registerEvents = () => {
  if(playerWindow.target !== null) {
    playerWindow.target.on('show', () => {
      sendMessage('show_state_change', true)
    })
    playerWindow.target.on('hide', () => {
      sendMessage('show_state_change', false)
    })
  }
}

export default registerEvents