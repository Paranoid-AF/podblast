import registerWindow from './window'
const eventRegistrars = {
  window: registerWindow
}
export const registerEvents = () => {
  Object.keys(eventRegistrars).forEach(val => {
    eventRegistrars[val as keyof typeof eventRegistrars]()
  })
}