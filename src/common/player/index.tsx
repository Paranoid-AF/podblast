import React from 'react'
import type { Props } from '../../../src-electron/ipc-main/handles/player'
import { EventTypes } from '../constants/enum'
import Player from './component'
import ReactDOM from 'react-dom'

let playerUpdater: ((props: Props) => void) | null = null

window.electron.on('update_props', (event, param) => {
  if(playerUpdater !== null) {
    playerUpdater(param)
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

export function renderPlayer() {
  ReactDOM.render(
    <Player
      getUpdater={
        (updater) => {
          playerUpdater = updater
        }
      }
      handleEvents={handleEvents}
    />,
    document.getElementById('root')
  )
}

export default Player