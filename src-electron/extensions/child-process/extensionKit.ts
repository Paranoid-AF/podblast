import path from 'path'
import { getLocale } from './utils'
import { sources, ExtensionInfo, SourceInfo, readIconFile } from '.'
import { updateSourceList } from './listener'

const registerSource = (sourceInfo: SourceInfo) => {
  const innerThis = (this as any).extensionKit
  if(typeof innerThis === 'undefined') {
    console.error("Extension ERROR: Unable to access ID while trying to initialize plugin.")
    return
  }
  if(innerThis.extensionInfo === null) {
    console.error("Extension ERROR: Initialization with global.init() is required before registering a source!")
    return
  }
  if(sourceInfo['icon']) {
    const fileBase = innerThis.extensionInfo.file
    sourceInfo['icon'] = readIconFile(path.join(fileBase, sourceInfo['icon']))
  }
  sources.push({...sourceInfo, provider: innerThis.extensionInfo.id})
  updateSourceList()
}

export const extensionKit = {
  registerSource,
  getLocale,
  extensionInfo: null as null | ExtensionInfo
}
