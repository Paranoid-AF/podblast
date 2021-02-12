import React, { useCallback, useState } from 'react'
import './index.less'

const dotSizeNormal = 14
const dotSizeSeeking = 18

function padNumber(num: number): string {
  let str = num.toString()
  while(str.length < 2) {
    str = '0' + str
  }
  return str
}

function convertTimeToString(time: number): string {
  const minute = (time / 60) | 0
  const second = (time % 60) | 0
  return padNumber(minute) + ':' + padNumber(second)
}

function SeekBar(props: Props) {
  const [seeking, setSeeking] = useState(false)
  const playedRatio = (props.seekCurrent / props.seekTotal * 100).toString()
  const loadedRatio = (props.seekLoaded / props.seekTotal * 100).toString()
  const dotSize = seeking ? dotSizeSeeking : dotSizeNormal

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    document.addEventListener('mouseup', handleMouseUp)
    setSeeking(true)
  }, [])

  const handleMouseUp = useCallback((e) => {
    document.removeEventListener('mouseup', handleMouseUp)
    setSeeking(false)
  }, [])

  return (
    <div className="control-seekbar show-when-open">
      <div className="info">
        <span className="info-title">{props.episodeTitle}</span>
        <span className="info-channel">{props.channel}</span>
      </div>
      <div className="bar">
        <div className="played" style={{ width: `${playedRatio}%` }}></div>
        <div className="loaded" style={{ width: `${(loadedRatio).toString()}%` }}></div>
        <div
          className="dot"
          style={{
            left: `calc(${playedRatio}% - ${(dotSize / 2).toString()}px)`,
            width: dotSize,
            height: dotSize
          }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>
      <div className="progress">
        <span className="start">{convertTimeToString(props.seekCurrent)}</span>
        <span className="end">{convertTimeToString(props.seekTotal)}</span>
      </div>
    </div>
  )
}

interface Props {
  episodeTitle: string,
  channel: string,
  seekCurrent: number,
  seekTotal: number,
  seekLoaded: number
}

export default SeekBar