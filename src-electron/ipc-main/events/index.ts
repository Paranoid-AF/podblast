import registerWindow from './window'
import registerExtensionMessage from './extension'
import registerConfigManager from './confmgr'
const eventRegistrars = {
  window: registerWindow,
  extension: registerExtensionMessage,
  conf: registerConfigManager
}
export const registerEvents = () => {
  Object.keys(eventRegistrars).forEach(val => {
    eventRegistrars[val as keyof typeof eventRegistrars]()
  })
}