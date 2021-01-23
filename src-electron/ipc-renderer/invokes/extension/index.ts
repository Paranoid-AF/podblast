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
  },
  removeExtension: async (id: string) => {
    return await ipcRenderer.invoke('extension', {
      action: "removeExtension",
      payload: id
    })
  }
}