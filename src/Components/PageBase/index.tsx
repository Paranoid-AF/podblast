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

const scrollBarHideTimeout = 3000 // ms
const collapseThreshold = 40 // px

const fontSizeScaler = scaleLinear().domain([finalTitleStyle.fontSize, initTitleStyle.fontSize]).range([0, collapseThreshold]).invert
const topScaler = scaleLinear().domain([finalTitleStyle.top, initTitleStyle.top]).range([0, collapseThreshold]).invert
const leftScaler = scaleLinear().domain([finalTitleStyle.left, initTitleStyle.left]).range([0, collapseThreshold]).invert

class PageBase extends React.PureComponent<Props> {
  state = {
    titleStyle: initTitleStyle,
    showScrollBar: true
  }
  hideScrollBarTimeout: null | NodeJS.Timeout = null
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
      })
      return
    }
    if(target >= collapseThreshold) {
      this.setState({
        titleStyle: initTitleStyle,
      })
      return
    }
    this.setState({
      titleStyle: this.calcTitleStyle(target),
    })
  }

  Container = React.forwardRef((props: any, ref: any) => (
    <div className={props.className} ref={ref} onScroll={props.onScroll}>
      {props.children}
    </div>
  ))

  componentDidUpdate() {
    if(this.props.afterUpdate) {
      this.props.afterUpdate()
    }
  }

  render() {
    let visible = true
    if(typeof this.props.visible !== 'undefined') {
      visible = this.props.visible
    }
    const { Container } = this
    const containerClassName = this.state.showScrollBar ? "pagebase-container" : "pagebase-container unscrollable"
    return (
      <div className="pagebase" style={{ display: visible ? 'block' : 'none' }}>
        <h1 className="pagebase-title" style={this.state.titleStyle}>{this.props.title}</h1>
        <div className="pagebase-titlebar"></div>
        <Container className={containerClassName} ref={this.props.innerRef} onScroll={this.handleScroll}>
          {this.props.children}
        </Container>
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
  innerRef?: React.RefObject<HTMLDivElement>,
  afterUpdate?: () => void,
  visible?: boolean
}

export default PageBase