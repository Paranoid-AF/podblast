/// <reference types="react-scripts" />
declare global {
  interface Window {
    electron: {
      invoke: (channel: string, content: InvokeContent) => Promise<IpcMessage>,
      on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    }
  }
}

interface IpcMessage {
  status: 'error' | 'success',
  info?: string,
  data?: any
}

export interface appWindowPayload {
  action: 'close' | 'minimize' | 'maximize' | 'restore'
}

interface InvokeContent {
  action: string,
  payload?: string
}