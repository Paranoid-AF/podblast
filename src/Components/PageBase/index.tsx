import React from 'react'
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
const scrollBarHideTimeout = 3000 // ms
const collapseThreshold = 40 // px

const fontSizeScaler = scaleLinear().domain([finalTitleStyle.fontSize, initTitleStyle.fontSize]).range([0, collapseThreshold]).invert
const topScaler = scaleLinear().domain([finalTitleStyle.top, initTitleStyle.top]).range([0, collapseThreshold]).invert
const leftScaler = scaleLinear().domain([finalTitleStyle.left, initTitleStyle.left]).range([0, collapseThreshold]).invert
const titleBarScaler = scaleLinear().domain([0, targetTitleBarOpacity]).range([0, collapseThreshold]).invert

class PageBase extends React.PureComponent<Props> {
  state = {
    titleStyle: initTitleStyle,
    titleBarOpacity: 0,
    showScrollBar: true
  }
  hideScrollBarTimeout: null | NodeJS.Timeout = null
  containerRef = React.createRef<HTMLDivElement>()
  calcTitleStyle = (target: number) => {
    return {
      fontSize: fontSizeScaler(target),
      top: topScaler(target),
      left: leftScaler(target)
    } as TitleStyle
  }

  handleScroll = (event: any) => {
    const top = event.target.scrollTop
    let target = collapseThreshold - top

    if(this.props.onScroll) {
      this.props.onScroll(event)
    }

    if(this.hideScrollBarTimeout) {
      clearTimeout(this.hideScrollBarTimeout)
      this.hideScrollBarTimeout = null
    }
    this.hideScrollBarTimeout = setTimeout(() => {
      this.setState({
        showScrollBar: false
      })
    }, scrollBarHideTimeout)
    this.setState({
      showScrollBar: true
    })

    if(target <= 0) {
      this.setState({
        titleStyle: finalTitleStyle,
        titleBarOpacity: targetTitleBarOpacity
      })
      return
    }
    if(target >= collapseThreshold) {
      this.setState({
        titleStyle: initTitleStyle,
        titleBarOpacity: 0
      })
      return
    }
    this.setState({
      titleStyle: this.calcTitleStyle(target),
      titleBarOpacity: titleBarScaler(collapseThreshold - target)
    })
  }

  render() {
    return (
      <div className="pagebase">
        <h1 className="pagebase-title" style={this.state.titleStyle}>{this.props.title}</h1>
        <div className="pagebase-titlebar" style={ { opacity: this.state.titleBarOpacity } }></div>
        <div className={ this.state.showScrollBar ? "pagebase-container" : "pagebase-container unscrollable" } onScroll={this.handleScroll} ref={this.containerRef}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

interface TitleStyle {
  fontSize: number,
  top: number,
  left: number
}

interface Props {
  title: string,
  children: any,
  onScroll?: React.UIEventHandler<HTMLDivElement>,
}

export default PageBase