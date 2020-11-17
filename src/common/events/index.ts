import appWindow from './window'

const eventListenerSets = [
  appWindow
]

export const listenEvents = () => {
  eventListenerSets.forEach((listenerSet) => {
    Object.keys(listenerSet).forEach((key) => {
      window.electron.on(key, listenerSet[key])  
    })
  })
}
