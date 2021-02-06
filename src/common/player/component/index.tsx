import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { Props } from '../../../../src-electron/ipc-main/handles/player'
import './index.less'
import ReactPlayer from 'react-player'

const resizeThreshold = 100

export default function Player(props: { getUpdater: (updater: ((props: Props) => void)) => void}) {
  const [ playerSize, setPlayerSize ] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [ playerProps, setPlayerProps ] = useState<Props>({})
  useEffect(() => {
    props.getUpdater(setPlayerProps)
  }, [])


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

