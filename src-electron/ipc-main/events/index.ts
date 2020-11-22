import registerWindow from './window'
import registerMessage from './message'
const eventRegistrars = {
  window: registerWindow,
  message: registerMessage
}
export const registerEvents = () => {
  Object.keys(eventRegistrars).forEach(val => {
    eventRegistrars[val as keyof typeof eventRegistrars]()
  })
}