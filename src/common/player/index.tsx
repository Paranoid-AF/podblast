import React from 'react'
import type { Props } from '../../../src-electron/ipc-main/handles/player'
import Player from './component'
import ReactDOM from 'react-dom'

const playState: Props = {
  url: 'https://www.youtube.com/watch?v=DLzxrzFCyOs'
}

let playerUpdater: ((props: Props) => void) | null = null

export function renderPlayer() {
  ReactDOM.render(
    <Player
      getUpdater={
        (updater) => {
          playerUpdater = updater
        }
      }
    />,
    document.getElementById('root')
  )
}

export default Player