import path from 'path'
import { NodeVM } from 'vm2'
import { runnerGlobal } from './global'

const allowedModules = [
  "axios",
  "got"
]

process.on('uncaughtException', (err) => {
  // TODO
  console.error('An error occurred in an extension.');
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