import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events['extension_ready'] = (event) => {
  store.dispatch.extension.toggleLoading(true)
}

events['extension_list'] = (event, extensionList) => {
  store.dispatch.extension.setExtensionList(extensionList)
}

events['source_list'] = (event, sourceList) => {
  store.dispatch.extension.setSourceList(sourceList)
}

export default events