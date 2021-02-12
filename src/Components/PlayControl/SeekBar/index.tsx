import React, { useCallback, useRef, useState } from 'react'
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
  const barRef = useRef<React.RefObject<HTMLDivElement>>(React.createRef())
  const barWidth = useRef<number>(-1)
  const lastX = useRef<number>(-1)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const dragFactor = 1
    const deltaX = e.clientX - lastX.current
    const deltaRatio = deltaX / barWidth.current * dragFactor
    props.onChange(deltaRatio * props.seekTotal)
    lastX.current = e.clientX
  }, [props])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
    setSeeking(false)
  }, [setSeeking, handleMouseMove])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const barInfo = barRef.current.current?.getBoundingClientRect()
    barWidth.current = barInfo?.width ?? -1
    if(barWidth.current > 0) {
      lastX.current = e.clientX
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove)
      setSeeking(true)
    }
  }, [setSeeking, handleMouseUp, handleMouseMove])


  return (
    <div className="control-seekbar show-when-open">
      <div className="info">
        <span className="info-title">{props.episodeTitle}</span>
        <span className="info-channel">{props.channel}</span>
      </div>
      <div className="bar" ref={barRef.current}>
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
  seekLoaded: number,
  onChange: (targetSeekCurrent: number) => any
}

export default SeekBar