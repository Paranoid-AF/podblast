import registerWindow from './window'
import registerExtensionMessage from './extension'
import registerConfigManager from './confmgr'
import registerPlayer from './player'
const eventRegistrars = {
  window: registerWindow,
  extension: registerExtensionMessage,
  conf: registerConfigManager,
  player: registerPlayer
}
export const registerEvents = () => {
  Object.keys(eventRegistrars).forEach(val => {
    eventRegistrars[val as keyof typeof eventRegistrars]()
  })
}