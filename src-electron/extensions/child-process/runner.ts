import { extensionKitName } from '../../constants/name'
import { NodeVM } from 'vm2'
import { ExtensionKit } from './extensionKit'
import { ExtensionInfo } from './'
import type { NotificationMessage } from '../../windows/main'

import { sender } from './ipc'

const [ send, disband ] = sender

process.on('uncaughtException', (err) => {
  send('notification', {
    title: 'Extension Runtime Error',
    content: 'An unknown error occurred in an extension.'
  } as NotificationMessage)
  console.error(err)
})

export const runInVM = (scriptPath: string, scriptMeta: ExtensionInfo) => {
  // Reset addtional info
  const extensionKit = new ExtensionKit(scriptMeta)
  const vm = new NodeVM({
    require: {
      external: {
        modules: [],
        transitive: true
      },
      mock: {
        [extensionKitName]: extensionKit
      }
    },
    sandbox: {}
  })
  return vm.runFile(scriptPath)
}
