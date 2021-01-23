import { ipcRenderer } from 'electron';
export const utils = {
  openExplorer: (directory: string) => {
    ipcRenderer.invoke('utils', {
      action: "openExplorer",
      payload: directory
    })
  }
}