import React, { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import './index.less'

const initTitleStyle: TitleStyle = {
  fontSize: 31,
  top: 15,
  left: 15
}

const finalTitleStyle: TitleStyle = {
  fontSize: 13,
  top: 6,
  left: 6
}

const targetTitleBarOpacity = 0.8

function PageBase(props: Props) {
  const [titleStyle, setTitleStye] = useState<TitleStyle>(initTitleStyle)
  const [titleBarOpacity, setTitleBarOpacity] = useState(0)
  const collapseThreshold = 40 // px
  const fontSizeScaler = scaleLinear().domain([finalTitleStyle.fontSize, initTitleStyle.fontSize]).range([0, collapseThreshold]).invert
  const topScaler = scaleLinear().domain([finalTitleStyle.top, initTitleStyle.top]).range([0, collapseThreshold]).invert
  const leftScaler = scaleLinear().domain([finalTitleStyle.left, initTitleStyle.left]).range([0, collapseThreshold]).invert
  const titleBarScaler = scaleLinear().domain([0, targetTitleBarOpacity]).range([0, collapseThreshold]).invert

  const calcTitleStyle = (target: number) => {
    return {
      fontSize: fontSizeScaler(target),
      top: topScaler(target),
      left: leftScaler(target)
    } as TitleStyle
  }

  const handleScroll = (event: any) => {
    const top = event.target.scrollTop
    let target = collapseThreshold - top
    if(target < 0) {
      target = 0
    }
    if(target > collapseThreshold) {
      target = collapseThreshold
    }
    setTitleStye(calcTitleStyle(target))
    setTitleBarOpacity(titleBarScaler(collapseThreshold - target))
  }

  return (
    <div className="pagebase">
      <h1 className="pagebase-title" style={titleStyle}>{props.title}</h1>
      <div className="pagebase-titlebar" style={ { opacity: titleBarOpacity } }></div>
      <div className="pagebase-container" onScroll={handleScroll}>
        {props.children}
      </div>
    </div>
  )
}

interface TitleStyle {
  fontSize: number,
  top: number,
  left: number
}

interface Props {
  title: string,
  children: any
}

export default PageBase