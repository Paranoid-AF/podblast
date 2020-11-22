import { ipcRenderer } from 'electron';
export const extension = {
  updateSources: () => {
    ipcRenderer.invoke('extension', {
      action: "updateSourceList"
    })
  },
  updateExtensions: () => {
    ipcRenderer.invoke('extension', {
      action: "updateExtensionList"
    })
  }
}