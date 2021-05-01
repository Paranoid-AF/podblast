import React from 'react'
import type { Props, ContentInfo } from '../../../src-electron/ipc-main/handles/player'
import { EventTypes } from '../constants/enum'
import Player from './component'
import ReactDOM from 'react-dom'
import { SeekTo } from './types'

import './index.less'

const defaultMediaCoverArt = '' // TODO: Make a default cover art.

declare const MediaMetadata: (params: Object) => any

let playerUpdater: ((props: Props) => void) | null = null
let seekTo: SeekTo | null = null

let currentPos: number = 0

function setUpMediaControlInfo(mediaInfo: ContentInfo['info']) {
  const mediaSession = (navigator as any)?.mediaSession
  if(mediaSession) {
    mediaSession.metadata = new (MediaMetadata as any)({
      title: mediaInfo?.title ?? 'Podblast',
      artist: mediaInfo?.channel ?? 'Podblast',
      artwork: [
        { src: mediaInfo?.coverArt ?? defaultMediaCoverArt, sizes: '1024x1024' }
      ]
    })
  }
}

function setUpMediaControlHandlers() {
  const mediaSession = (navigator as any)?.mediaSession
  mediaSession.setActionHandler('previoustrack', async () => {
    const config: any = await window.electron.invoke('player', { action: 'getConfig' })
    if(seekTo) {
      seekTo(currentPos - config.backward, 'seconds')
    }
  })
  mediaSession.setActionHandler('nexttrack', async () => {
    const config: any = await window.electron.invoke('player', { action: 'getConfig' })
    if(seekTo) {
      seekTo(currentPos + config.forward, 'seconds')
    }
  })
}

window.electron.on('update_props', (event, param) => {
  if(playerUpdater !== null) {
    playerUpdater(param)
    setUpMediaControlInfo(param.info)
    setUpMediaControlHandlers()
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
  if(type === EventTypes.ON_PROGRESS) {
    currentPos = payload['playedSeconds']
  }
}

const getSeekTo = (targetSeekTo: SeekTo) => {
  seekTo = targetSeekTo
}

export function renderPlayer() {
  document.body.style.background = '#000';
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