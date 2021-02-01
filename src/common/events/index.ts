import appWindow from './window'
import message from './message'
import extension from './extension'
import app from './app'

const eventListenerSets = [
  appWindow,
  message,
  extension,
  app
]

export const listenEvents = () => {
  eventListenerSets.forEach((listenerSet) => {
    Object.keys(listenerSet).forEach((key) => {
      window.electron.on(key, listenerSet[key])  
    })
  })
}
