import { contextBridge, ipcRenderer } from 'electron';

const registerEventHandler = (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
  ipcRenderer.on(channel, callback)
}

const invoke = async (channel: string, content: InvokeContent) => {
  return await ipcRenderer.invoke(channel, content)
}

contextBridge.exposeInMainWorld(
  'electron', {
    invoke,
    on: registerEventHandler
  }
)

interface InvokeContent {
  action: string,
  payload?: string
}