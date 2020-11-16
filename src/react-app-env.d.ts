/// <reference types="react-scripts" />

declare global {
  interface Window {
    electron: {
      appWindow: {
        close: () => void,
        maximize: () => void,
        minimize: () => void,
        restore: () => void
      }
    }
  }
}

export interface appWindowPayload {
  action: 'close' | 'minimize' | 'maximize' | 'restore'
}