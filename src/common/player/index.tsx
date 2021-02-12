import React from 'react'
import type { Props } from '../../../src-electron/ipc-main/handles/player'
import { EventTypes } from '../constants/enum'
import Player from './component'
import ReactDOM from 'react-dom'
import { SeekTo } from './types'

let playerUpdater: ((props: Props) => void) | null = null
let seekTo: SeekTo | null = null

window.electron.on('update_props', (event, param) => {
  if(playerUpdater !== null) {
    playerUpdater(param)
  }
})

window.electron.on('seek_to', (event, param) => {
  if(seekTo !== null) {
    seekTo(param.amount, param.type)
  }
})

const handleEvents = (type: EventTypes, payload?: any) => {
  window.electron.invoke('playerComponent', {
    action: 'event',
    payload: {
      type,
      payload
    }
  })
}

const getSeekTo = (targetSeekTo: SeekTo) => {
  seekTo = targetSeekTo
}

export function renderPlayer() {
  ReactDOM.render(
    <Player
      getUpdater={
        (updater) => {
          playerUpdater = updater
        }
      }
      handleEvents={handleEvents}
      getSeekTo={getSeekTo}
    />,
    document.getElementById('root')
  )
}

export default Player