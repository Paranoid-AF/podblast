import playerWindow from '../../../windows/player'
export function sendMessage(channel: string, ...args: any) {
  if(playerWindow.target !== null) {
    playerWindow.target.webContents.send(channel, args)
  }
}