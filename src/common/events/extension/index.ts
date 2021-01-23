import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events['extension_ready'] = (event, lists) => {
  store.dispatch.extension.toggleLoaded({
    state: true,
    extensionList: lists[0],
    sourceList: lists[1]
  })
}

events['extension_list'] = (event, extensionList) => {
  console.log(extensionList)
  store.dispatch.extension.setExtensionList(extensionList)
}

events['source_list'] = (event, sourceList) => {
  store.dispatch.extension.setSourceList(sourceList)
}

export default events