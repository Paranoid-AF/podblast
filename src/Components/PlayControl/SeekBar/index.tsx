import { LoadingOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import './index.less'

const dotSizeNormal = 14
const dotSizeSeeking = 18
const messageKey = 'seekbar-speed'

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

function getDragFactor(posY: number, baseLine: number): number {
  const pageHeight = document.body.offsetHeight
  const deltaY = Math.abs(posY - baseLine)
  let factor: number = 1
  if(deltaY > pageHeight / 5) {
    factor = 0.5
  }
  if(deltaY > pageHeight / 3) {
    factor = 0.25
  }
  if(deltaY > pageHeight / 2) {
    factor = 0.125
  }
  if(deltaY > pageHeight / 1.2) {
    factor = 0.05
  }
  if(deltaY > pageHeight) {
    factor = 0.01
  }
  return factor
}

function SeekBar(props: Props) {
  const [seeking, setSeeking] = useState(false)
  const currentTime = useRef<number | null>(null)
  let seekCurrent = props.seekCurrent
  if(currentTime.current !== null) {
    seekCurrent = currentTime.current
  }
  if(seekCurrent < 0) {
    seekCurrent = 0
  }
  if(seekCurrent > props.seekTotal) {
    seekCurrent = props.seekTotal
  }
  const playedRatio = (seekCurrent / props.seekTotal * 100).toString()
  const loadedRatio = (props.seekLoaded / props.seekTotal * 100).toString()
  const dotSize = seeking ? dotSizeSeeking : dotSizeNormal
  const barRef = useRef<React.RefObject<HTMLDivElement>>(React.createRef())
  const barWidth = useRef<number>(-1)
  const baseLine = useRef<number>(-1)
  const lastX = useRef<number>(-1)
  const lastDragFator = useRef<number>(-1)
  
  const getDeltaSec = useCallback((clientX: number, dragFactor: number) => {
    const deltaX = clientX - lastX.current
    const deltaRatio = deltaX / barWidth.current * dragFactor
    const deltaSec = deltaRatio * props.seekTotal
    return deltaSec
  }, [props.seekTotal])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const dragFactor = getDragFactor(e.clientY, baseLine.current)
    const deltaSec = getDeltaSec(e.clientX, dragFactor)
    if(dragFactor !== lastDragFator.current) {
      message.info({
        content: `Seeking with ${dragFactor}x factor`,
        key: messageKey,
        duration: 0
      })
    }
    if(currentTime.current !== null) {
      currentTime.current = currentTime.current + deltaSec
      props.onChange(currentTime.current)
    }
    lastX.current = e.clientX
    lastDragFator.current = dragFactor
  }, [props, getDeltaSec])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if(currentTime.current !== null) {
      props.onChange(currentTime.current)
    }
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
    currentTime.current = null
    setSeeking(false)
    lastDragFator.current = -1
    message.destroy(messageKey)
    document.querySelectorAll('iframe').forEach(val => {
      val.style.pointerEvents = ''
    })
  }, [setSeeking, handleMouseMove, props])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const barInfo = barRef.current.current?.getBoundingClientRect()
    barWidth.current = barInfo?.width ?? -1
    baseLine.current = -1
    if(typeof barInfo?.y === 'number' && typeof barInfo?.height === 'number') {
      baseLine.current = barInfo.y + (barInfo.height / 2)
    }
    if(barWidth.current > 0 && baseLine.current > 0) {
      lastX.current = e.clientX
      currentTime.current = props.seekCurrent
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove)
      setSeeking(true)
      document.querySelectorAll('iframe').forEach(val => {
        val.style.pointerEvents = 'none'
      })
    }
  }, [setSeeking, handleMouseUp, handleMouseMove, props.seekCurrent])


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
        >
          {
            props.loading ?
            <div className="loading-indicator"><LoadingOutlined /></div> :
            null
          }
        </div>
      </div>
      <div className="progress">
        <span className="start">{convertTimeToString(seekCurrent)}</span>
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
  loading: boolean,
  onChange: (amount: number) => any
}

export default SeekBar