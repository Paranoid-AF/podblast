import { ExtensionInfo, SourceInfo, extensionProcess } from '../../../extensions'
import { sendPopupMessage, PopupMessage, sendNotification, NotificationMessage } from '../../../windows/main'
import mainWindow from '../../../windows/main'
import { resolver } from '../../../extensions/ipc'
import { sendMessage } from '../common'
import { connection } from '../../../data'
import { Extension } from '../../../data/entity/Extension'

export const cachedLists: Array< Array<ExtensionInfo> | Array<SourceInfo> > = [ [] , [] ]

const registerEvents = () => {
  if(!extensionProcess) {
    return
  }

  const [ addChannel, cancelChannel, disband ] = resolver

  addChannel('popup', (msg: PopupMessage) => {
    sendPopupMessage(msg)
  })

  addChannel('notification', (msg: NotificationMessage) => {
    sendNotification(msg)
  })

  addChannel('extensionReady', (lists: any) => {
    cachedLists[0] = lists[0]
    cachedLists[1] = lists[1]
    if(mainWindow.target !== null) {
      mainWindow.target.on('ready-to-show', () => {
        sendMessage('extension_ready', cachedLists)
      })
    }
  })

  addChannel('extensionList', (extensionList: any) => {
    cachedLists[0] = extensionList
    sendMessage('extension_list', extensionList)
  })

  addChannel('sourceList', (sourceList: any) => {
    cachedLists[1] = sourceList
    sendMessage('source_list', sourceList)
  })

  addChannel('getExtensionInfo', async (extensionId: string) => {
    if(!connection.current) {
      return null
    }
    const repo = connection.current.getRepository(Extension)
    let original = await repo.findOne({ extensionId })
    if(typeof original === 'undefined') {
      original = new Extension()      
      original['extensionId'] = extensionId
      await repo.save(original)
      original = await repo.findOne({ extensionId })
    }
    return original
  })

}

export default registerEvents