import { contextBridge, ipcRenderer } from 'electron';
import invokes from './invokes'

const registerEventHandler = (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
  ipcRenderer.on(channel, callback)
}

contextBridge.exposeInMainWorld(
  'electron', {
    ...invokes,
    on: registerEventHandler
  }
)