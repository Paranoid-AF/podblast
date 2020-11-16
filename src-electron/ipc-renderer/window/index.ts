import { ipcRenderer } from 'electron';
export const appWindow = {
  close: () => {
    ipcRenderer.invoke('appWindow', {
      action: "close"
    })
  },
  maximize: () => {
    ipcRenderer.invoke('appWindow', {
      action: "maximize"
    })
  },
  minimize: () => {
    ipcRenderer.invoke('appWindow', {
      action: "minimize"
    })
  },
  restore: () => {
    ipcRenderer.invoke('appWindow', {
      action: "restore"
    })
  }
}