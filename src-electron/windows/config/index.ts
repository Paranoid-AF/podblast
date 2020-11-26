import { BrowserWindowConstructorOptions } from 'electron'
import path from 'path'
import { Platforms, getPlatform } from '../../constants/os'
const currentPlatform = getPlatform()
const windowConf: BrowserWindowConstructorOptions = {
  show: false,
  webPreferences: {
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    preload: path.join(__dirname, '../../ipc-renderer/index.js'),
    contextIsolation: true
  },
  minWidth: 650,
  minHeight: 400
}
if(currentPlatform === Platforms.WINDOWS) {
  windowConf.frame = false
} else {
  windowConf.frame = true
}
export default windowConf