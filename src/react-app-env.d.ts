/// <reference types="react-scripts" />
declare global {
  interface Window {
    electron: {
      appWindow: {
        close: () => void,
        maximize: () => void,
        minimize: () => void,
        restore: () => void,
        isMaximized: () => Promise<boolean>
      },
      extension: {
        updateExtensions: () => void,
        updateSources: () => void,
        removeExtension: (extensionId: string) => Promise<IpcMessage>
      },
      utils: {
        openExplorer: (path: string) => void
      },
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