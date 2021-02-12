import { screen } from 'electron'
import { sendMessage as sendMessage_Player } from './sendMessage'
import playerWindow from '../../../windows/player'
import { pipMinimumSize } from '../../../constants/value'
import  {sendMessage as sendMessage_Main } from '../../events/common'
// import { EventTypes } from './enums'

const windowMargin = 50

interface ExtensionPayload {
  action: string,
  payload?: any
}

interface PlayerProps {
  url: string,
  playing: boolean,
  loop: boolean,
  volume?: number | null,
  muted: boolean,
  playbackRate: number,
  progressInterval: number
}

export type Props = Partial<PlayerProps>

let current: Props = { }

function togglePlayerWindow(state: boolean) {
  if(playerWindow.target !== null) {
    if(state) {
      playerWindow.target.setSize(pipMinimumSize.width, pipMinimumSize.height)
      const display = screen.getPrimaryDisplay()
      const windowSize = playerWindow.target.getSize()
      const windowX = display.bounds.width - windowSize[0] - windowMargin
      const windowY = display.bounds.height - windowSize[1] - windowMargin
      playerWindow.target.setPosition(windowX, windowY)
      playerWindow.target.show()
    } else {
      playerWindow.target.hide()
    }
  }
}

function setPlayParams(params: Props) {
  current = {
    ...current,
    ...params
  }
  sendMessage_Player('update_props', current)
}

function seekTo(amount: number, type: 'seconds' | 'fraction' = 'seconds') {
  sendMessage_Player('seek_to', {
    type,
    amount
  })
}

export const player = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  switch(payload.action) {
    case 'togglePlayerWindow':
      const state = payload.payload as boolean
      togglePlayerWindow(state)
    break
    case 'setParams':
      setPlayParams(payload.payload)
    break
    case 'seekTo':
      seekTo(payload.payload)
    break
  }
}

export const playerComponent = (event: Electron.IpcMainInvokeEvent, payload: ExtensionPayload) => {
  switch(payload.action) {
    case 'event':
      if(typeof payload.payload?.payload === 'undefined') {
        sendMessage_Main('player_event', {
          type: payload.payload.type
        })
      } else {
        sendMessage_Main('player_event', payload.payload)
      }
      
    break
  }
}

