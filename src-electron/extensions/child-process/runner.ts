import path from 'path'
import { NodeVM } from 'vm2'
import { runnerGlobal } from './global'
import type { PopupMessage } from '../../windows/main'

const allowedModules = [
  "axios",
  "got"
]

process.on('uncaughtException', (err) => {
  if(process.send) {
    process.send({
      icon: 'error',
      content: 'An unknown error occurred in an extension.'
    } as PopupMessage)
  }
})

export const runInVM = (scriptCode: string) => {
  // Reset addtional info
  runnerGlobal.extensionInfo = null
  const vm = new NodeVM({
    require: {
      external: {
        modules: allowedModules,
        transitive: true
      }
    },
    sandbox: Object.assign({ }, runnerGlobal)
  })
  return vm.run('window = global;' + scriptCode, path.join(process.cwd(), '/node_modules'))
}

/*
  Context is always resetted.
  runInVM('global.init = () => {console.log("foo")}; global.init(); global.init = () => {console.log("bar")};')
  runInVM('global.init()')
*/