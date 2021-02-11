import React, { Fragment, useEffect, useRef, useCallback, useState } from 'react'
import './index.less'

const scrollInterval = 10

function ScrollingText(props: Props) {
  const boxRef = useRef<React.RefObject<HTMLDivElement>>(React.createRef())
  const currentPos = useRef(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  const timerFunc = useCallback(() => {
    const scroller = boxRef.current?.current
    if(scroller) {
      const inner = scroller.querySelector('.wrapped')
      if(inner) {
        const childWidth = (inner.querySelector('span')?.getBoundingClientRect().width ?? 0) + props.whiteSpaceWidth
        currentPos.current += props.pixelsPerSecond * (scrollInterval / 1000)
        if(currentPos.current > childWidth || !shouldScroll) {
          currentPos.current = 0
        }
        inner.setAttribute('style', `transform: translateX(-${currentPos.current}px);`)
      }
    }
  }, [currentPos, props, shouldScroll])
  useEffect(() => {
    if(timer.current !== null) {
      clearInterval(timer.current)
    }
    timer.current = setInterval(timerFunc, scrollInterval)
    const scroller = boxRef.current?.current
    if(scroller) {
      const inner = scroller.querySelector('.wrapped')
      if(inner) {
        const childWidth = (inner.querySelector('span')?.getBoundingClientRect().width ?? 0) + props.whiteSpaceWidth
        setShouldScroll(inner.getBoundingClientRect().width < childWidth)
      }
    }
  }, [timerFunc, boxRef, props.whiteSpaceWidth])
  return (
    <div className="scrolling-text" style={{ width: props.width }} ref={boxRef.current}>
      <div className="wrapped">
        <span>{props.children}</span>
        {
          shouldScroll ?
          (
            <Fragment>
              <span className="whitespace" style={{ margin: `0 ${props.whiteSpaceWidth / 2}px` }}></span>
              <span>{props.children}</span>
            </Fragment>
          )
          : null
        }
      </div>
    </div>
  )
}

interface Props {
  children: any,
  width: number, // px
  pixelsPerSecond: number, // px
  whiteSpaceWidth: number
}

export default ScrollingText