import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { Props } from '../../../../src-electron/ipc-main/handles/player'
import './index.less'
import { EventTypes } from '../../constants/enum'
import ReactPlayer from 'react-player'

const resizeThreshold = 100
const progressInterval = 500

export default function Player(props: PlayerProps) {
  const [ playerSize, setPlayerSize ] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [ playerProps, setPlayerProps ] = useState<Props>({})
  useEffect(() => {
    props.getUpdater(setPlayerProps)
  }, [props])
  const playEvents = useRef({
    onReady: () => { props.handleEvents(EventTypes.ON_READY) },
    onStart: () => { props.handleEvents(EventTypes.ON_START) },
    onPlay: () => { props.handleEvents(EventTypes.ON_PLAY) },
    onProgress: (payload: any) => { props.handleEvents(EventTypes.ON_PROGRESS, payload) },
    onDuration: (payload: any) => { props.handleEvents(EventTypes.ON_DURATION, payload) },
    onPause: () => { props.handleEvents(EventTypes.ON_PAUSE) },
    onBuffer: () => { props.handleEvents(EventTypes.ON_BUFFER) },
    onBufferEnd: () => { props.handleEvents(EventTypes.ON_BUFFEREND) },
    onSeek: (payload: any) => { props.handleEvents(EventTypes.ON_SEEK, payload) },
    onEnded: (payload: any) => { props.handleEvents(EventTypes.ON_ENDED, payload) },
    onError: (payload: any) => { props.handleEvents(EventTypes.ON_ERROR, payload) }
  })

  let lastResize = useRef(Date.now())
  let timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleResize = useCallback(() => {
    setPlayerSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])
  useEffect(() => {
    window.addEventListener('resize', () => {
      if(Date.now() - lastResize.current > resizeThreshold) {
        if(timer.current !== null) {
          clearTimeout(timer.current)
        }
        handleResize()
      } else {
        timer.current = setTimeout(handleResize, resizeThreshold)
      }
      lastResize.current = Date.now()
    })
  }, [handleResize])
  const playerComponent = React.createElement(ReactPlayer, {
    ...playerProps,
    ...playEvents.current,
    progressInterval: progressInterval,
    width: playerSize.width,
    height: playerSize.height
  } as any)
  return (
    <div className="player-container">
      <div className="player-drag"></div>
      { playerComponent }
    </div>
  )
}

interface PlayerProps {
  getUpdater: (updater: ((props: Props) => void)) => void,
  handleEvents: (type: EventTypes, payload?: any) => void
}

