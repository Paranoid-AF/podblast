import registerWindow from './window'
import registerExtensionMessage from './extension'
const eventRegistrars = {
  window: registerWindow,
  extension: registerExtensionMessage
}
export const registerEvents = () => {
  Object.keys(eventRegistrars).forEach(val => {
    eventRegistrars[val as keyof typeof eventRegistrars]()
  })
}