import React, { useEffect, useRef, useCallback } from 'react'
import './index.less'

const scrollInterval = 10

function ScrollingText(props: Props) {
  const boxRef = useRef<React.RefObject<HTMLDivElement>>(React.createRef())
  const currentPos = useRef(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const timerFunc = useCallback(() => {
    const scroller = boxRef.current?.current
    if(scroller) {
      const inner = scroller.querySelector('.wrapped')
      if(inner) {
        const childWidth = (inner.querySelector('span')?.getBoundingClientRect().width ?? 0) + props.whiteSpaceWidth
        currentPos.current += scrollInterval / props.fullScrollTime
        if(currentPos.current > 1 || inner.getBoundingClientRect().width >= childWidth) {
          currentPos.current = 0
        }
        inner.setAttribute('style', `transform: translateX(-${currentPos.current * childWidth}px);`)
      }
    }
  }, [currentPos, props])
  useEffect(() => {
    if(timer.current !== null) {
      clearInterval(timer.current)
    }
    timer.current = setInterval(timerFunc, scrollInterval)
  }, [timerFunc])
  return (
    <div className="scrolling-text" style={{ width: props.width }} ref={boxRef.current}>
      <div className="wrapped">
        <span>{props.children}</span>
        <span className="whitespace" style={{ margin: `0 ${props.whiteSpaceWidth / 2}px` }}></span>
        <span>{props.children}</span>
      </div>
    </div>
  )
}

interface Props {
  children: any,
  width: number, // px
  fullScrollTime: number, // ms
  whiteSpaceWidth: number
}

export default ScrollingText