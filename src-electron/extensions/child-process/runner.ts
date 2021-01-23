import { NodeVM } from 'vm2'
import { runnerGlobal } from './global'
import { ExtensionInfo } from './'
import type { NotificationMessage } from '../../windows/main'

import { sender } from './ipc'

const [ send, disband ] = sender

const allowedModules = [
  "axios",
  "got"
]

process.on('uncaughtException', (err) => {
  send('notification', {
    title: 'Extension Runtime Error',
    content: 'An unknown error occurred in an extension.'
  } as NotificationMessage)
  console.error(err)
})

export const runInVM = (scriptPath: string, scriptMeta: ExtensionInfo) => {
  // Reset addtional info
  runnerGlobal.extensionInfo = scriptMeta
  const vm = new NodeVM({
    require: {
      external: {
        modules: allowedModules,
        transitive: true
      }
    },
    sandbox: Object.assign({ }, runnerGlobal)
  })
  return vm.runFile(scriptPath)
}

/*
  Context is always resetted.
  runInVM('global.init = () => {console.log("foo")}; global.init(); global.init = () => {console.log("bar")};')
  runInVM('global.init()')
*/