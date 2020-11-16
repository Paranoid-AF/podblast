import { ipcMain } from 'electron'
import handles from './handles'
const handleKeys = Object.keys(handles)
handleKeys.forEach(handleName => {
  ipcMain.handle(handleName, handles[handleName as keyof typeof handles])
})
export default handleKeys