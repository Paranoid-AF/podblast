import React, { useCallback, useRef, useState } from 'react'
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import { Slider } from 'antd'

import './index.less'

function VolumeHandle(props: Props) {
  const [showVolumeHandle, toggleVolumeHandle] = useState(false)
  const [tempVolume, setTempVolume] = useState(-1)
  const volume = tempVolume >= 0 ? tempVolume : props.volume
  const isChangingVolume = useRef(false)
  const handleVolumeMouseHover = useCallback((e: React.MouseEvent) => {
    toggleVolumeHandle(true)
  }, [toggleVolumeHandle])
  const handleVolumeMouseLeave = useCallback((e: React.MouseEvent) => {
    if(!isChangingVolume.current) {
      toggleVolumeHandle(false)
    }
  }, [toggleVolumeHandle])
  const handleVolumeMouseDown = useCallback((e: React.MouseEvent) => {
    isChangingVolume.current = true
  }, [])
  const handleVolumeChange = useCallback((value: number) => {
    const targetValue = value / 100
    setTempVolume(targetValue)
    if(props.onVolumeChange) {
      props.onVolumeChange(targetValue)
    }
    const iframe = document.querySelector('.nowplaying') as HTMLIFrameElement | null
    if(iframe) {
      iframe.style.pointerEvents = 'none'
    }
  }, [props])
  const handleVolumeAfterChange = useCallback((value: number) => {
    const targetValue = value / 100
    setTempVolume(-1)
    toggleVolumeHandle(false)
    isChangingVolume.current = false
    if(props.onVolumeAfterChange) {
      props.onVolumeAfterChange(targetValue)
    }
    const iframe = document.querySelector('.nowplaying') as HTMLIFrameElement | null
    if(iframe) {
      iframe.style.pointerEvents = 'all'
    }
  }, [props])
  const handleMute = useCallback(() => {
    if(props.onMuteChange) {
      props.onMuteChange(!props.muted)
      toggleVolumeHandle(false)
    }
  }, [props, toggleVolumeHandle])

  return (
    <div className="volume show-when-open"
      onMouseEnter={handleVolumeMouseHover}
      onMouseLeave={handleVolumeMouseLeave}
      onMouseDown={handleVolumeMouseDown}
    >
      <div className="volume-control"
        style={{
          visibility: showVolumeHandle ? 'visible' : 'hidden'
        }}
      >
        <div className="decoration"></div>
        <Slider
          vertical
          value={volume * 100}
          onChange={handleVolumeChange}
          onAfterChange={handleVolumeAfterChange}
        />
      </div>
      <button className="volume-btn" onClick={handleMute}>
        {
          props.muted ?
          <FaVolumeMute /> :
          <FaVolumeDown />
        }
      </button>
    </div>
  )
}

interface Props {
  volume: number,
  muted: boolean,
  onMuteChange?: (value: boolean) => void,
  onVolumeChange?: (value: number) => void,
  onVolumeAfterChange?: (value: number) => void
}

export default VolumeHandle
