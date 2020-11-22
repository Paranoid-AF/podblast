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
        updateSources: () => void
      },
      on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
    }
  }
}

export interface appWindowPayload {
  action: 'close' | 'minimize' | 'maximize' | 'restore'
}