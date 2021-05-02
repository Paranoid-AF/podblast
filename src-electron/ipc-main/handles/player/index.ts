import type { IpcMainInvokeEvent } from 'electron'
import { screen } from 'electron'
import { config } from '../../../confmgr'
import { sendMessage as sendMessage_Player } from './sendMessage'
import mainWindow from '../../../windows/main'
import playerWindow from '../../../windows/player'
import { pipMinimumSize } from '../../../constants/value'
import  {sendMessage as sendMessage_Main } from '../../events/common'
import { getExtensionConfig } from '../../../extensions'
// import { EventTypes } from './enums'

const windowMargin = 50
const matchPac = new RegExp(/pac\+(.*)/)

interface ExtensionAction {
  type: string,
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

export interface ContentInfo {
  info?: {
    title: string,
    coverArt: string,
    channel: string
  }
}

export type Props = Partial<PlayerProps> & ContentInfo

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

export const player = async (event: IpcMainInvokeEvent, action: ExtensionAction) => {
  switch(action.type) {
    case 'togglePlayerWindow':
      const state = action.payload as boolean
      togglePlayerWindow(state)
      break
    case 'setParams':
      setPlayParams(action.payload)
      break
    case 'seekTo':
      seekTo(action.payload)
      break
    case 'getConfig':
      return {
        backward: config['player.backwardTime'],
        forward: config['player.forwardTime']
      }
    case 'setProxy':
      const extensionName = action.payload['extensionName']
      return (async () => {
        let proxyAddress = ''
        if(config['network.proxyEnabled'] === 'enabled') {
          proxyAddress = config['network.proxyAddress'] ?? ''
        }
        if(extensionName !== '') {
          const extensionConf = await getExtensionConfig(extensionName)
          if(extensionConf) {
            const proxyType = (extensionConf.proxy ?? 'useGlobal') as 'useGlobal' | 'enabled' | 'disabled'
            if(proxyType === 'enabled') {
              proxyAddress = extensionConf.proxyAddress ?? ''
            }
            if(proxyType === 'disabled') {
              proxyAddress = ''
            }
          }
        }
        if(proxyAddress !== '') {
          const pacResult = proxyAddress.match(matchPac)
          const proxyConf: Electron.Config = {}
          let pacAddress = ''
          if(pacResult !== null) {
            pacAddress = pacResult[1]
          }
          if(pacAddress === '') {
            proxyConf.proxyRules = proxyAddress
          } else {
            proxyConf.pacScript = pacAddress
          }
          if(playerWindow.target) {
            await playerWindow.target.webContents.session.setProxy(proxyConf)
          }
        } else {
          if(playerWindow.target) {
            await playerWindow.target.webContents.session.setProxy({
              pacScript: '',
              proxyRules: ''
            })
          }
        }
      })()
    case 'setUserAgent':
      if(playerWindow.target) {
        let userAgent: string = action.payload
        if(userAgent === '' && mainWindow.target) {
          userAgent = mainWindow.target.webContents.getUserAgent()
        }
        playerWindow.target.webContents.setUserAgent(userAgent)
      }
      break
  }
}

export const playerComponent = (event: IpcMainInvokeEvent, action: ExtensionAction) => {
  switch(action.type) {
    case 'event':
      if(typeof action.payload?.payload === 'undefined') {
        sendMessage_Main('player_event', {
          type: action.payload.type
        })
      } else {
        sendMessage_Main('player_event', action.payload)
      }
      
    break
  }
}

