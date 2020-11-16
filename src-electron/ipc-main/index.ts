import { ipcMain } from 'electron'
import handles from './handles'
import { registerEvents } from './events'
const handleKeys = Object.keys(handles)
handleKeys.forEach(handleName => {
  ipcMain.handle(handleName, handles[handleName as keyof typeof handles])
})
export { handleKeys, registerEvents }