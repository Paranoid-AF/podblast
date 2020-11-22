import appWindow from './window'
import message from './message'

const eventListenerSets = [
  appWindow,
  message
]

export const listenEvents = () => {
  eventListenerSets.forEach((listenerSet) => {
    Object.keys(listenerSet).forEach((key) => {
      window.electron.on(key, listenerSet[key])  
    })
  })
}
