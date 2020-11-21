import { getLocale } from './utils'
import { extensions, sources, ExtensionInfo, SourceInfo } from './'

const init = (extensionInfo: ExtensionInfo) => {
  const innerThis = (this as any).runnerGlobal
  if(typeof innerThis === 'undefined') {
    console.error("Extension ERROR: Unable to access ID while trying to initialize plugin.")
    return
  }
  innerThis.extensionInfo = extensionInfo
  extensions.push(extensionInfo)
}

const registerSource = (sourceInfo: SourceInfo) => {
  const innerThis = (this as any).runnerGlobal
  if(typeof innerThis === 'undefined') {
    console.error("Extension ERROR: Unable to access ID while trying to initialize plugin.")
    return
  }
  if(innerThis.extensionInfo === null) {
    console.error("Extension ERROR: Initialization with global.init() is required before registering a source!")
    return
  }
  sources.push({...sourceInfo, provider: innerThis.extensionInfo.id})
}

export const runnerGlobal = {
  init,
  registerSource,
  getLocale,
  extensionInfo: null as null | ExtensionInfo
}
