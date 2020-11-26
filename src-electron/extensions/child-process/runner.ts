import { NodeVM } from 'vm2'
import { runnerGlobal } from './global'
import { ExtensionInfo } from './'
import type { PopupMessage } from '../../windows/main'
import { sender as senderInit } from 'ipc-promise-invoke'

const sender = senderInit(process)

const allowedModules = [
  "axios",
  "got"
]

process.on('uncaughtException', (err) => {
  sender('popup', {
    icon: 'error',
    content: 'An unknown error occurred in an extension.'
  } as PopupMessage)
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