import React, { Component } from 'react'
import { Tooltip } from 'antd'
import './index.less'

class PanelItem extends Component <Props, State> {
  static defaultProps = {
    color: "#0074aa",
    hidden: false,
    tooltip: true,
    active: false,
    dragged: false,
    onMouseDown: null
  }
  
  state = {
    tooltip: false,
    pressed: false
  }

  itemRef: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount() {
    this.sendRef()
  }

  componentDidUpdate() {
    this.sendRef()
  }
  
  static getDerivedStateFromProps(props: Props, state: State) {
    if(props.hidden) {
      return {
        pressed: false
      }
    }
    return null
  }

  sendRef() {
    if(typeof this.props.setRef === "function") {
      this.props.setRef(this.props.id, this.itemRef)
    }
  }

  handleTooltip = (visible: boolean )=> {
    this.setState(() => ({
      tooltip: this.props.tooltip && !this.props.dragged && visible
    }))
  }

  renderActiveIndicator = () => {
    if(this.props.active && !this.props.dragged) {
      return (
        <div className="panel-item-active">
          <div className="panel-item-active-indicator"></div>
        </div>
      )
    }
  }

  processMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if(e.button !== 0) {
      return
    }
    if(typeof this.props.onMouseDown === "function") {
      this.props.onMouseDown(e, this.props.id)
      this.setState({
        tooltip: false,
      })
    }
    this.setState({
      pressed: true
    })
  }

  processClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if(typeof this.props.onClick === "function") {
      this.props.onClick(e, this.props.id)
    }
  }

  onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      pressed: false
    })
  }

  renderFinal() {
    const itemStyle: ItemStyle = {
      backgroundColor: this.props.color
    }
    if("image" in this.props && this.props.image !== undefined) {
      itemStyle.backgroundImage = `url(${this.props.image})`
    }
    let itemClassName = this.props.dragged ? "panel-item panel-item-drag" : "panel-item panel-item-visible"
    if(this.state.pressed) {
      itemClassName += " panel-item-pressed"
    }
    return (
      <div className="panel-item-wrapper">
      <div ref={this.itemRef} className={itemClassName} style={ itemStyle } onMouseDown={this.processMouseDown} onClick={this.processClick} onMouseUp={this.onMouseUp} >
        {
          !this.props.image && 
          (
            <div className="panel-item-text">
              { this.props.name.substring(0, 1) }
            </div>
          )
        }
      </div>
      { this.renderActiveIndicator() }
    </div>
    )
  }

  render() {
    if(this.props.hidden) {
      return (
        <div className="panel-item-wrapper">
          <div className="panel-item panel-item-hidden"></div>
          { this.renderActiveIndicator() }
        </div>
      )
    }
    if(!this.props.dragged) {
      return (
        <Tooltip overlayClassName="panel-tooltip" placement="right" title={<span>{this.props.name}</span>} onVisibleChange={this.handleTooltip} visible={this.state.tooltip}>
          {this.renderFinal()}
        </Tooltip>
      )
    } else {
      return this.renderFinal()
    }
  }
}

interface ItemStyle {
  backgroundColor: string,
  backgroundImage?: string
}

type State = {
  tooltip?: boolean,
  pressed: boolean
}

type Props = {
  name: string,
  id: string,
  color: string,
  image?: string,
  hidden?: boolean,
  tooltip?: boolean,
  active?: boolean,
  dragged?: boolean,
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => void,
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => void,
  setRef: ((key: string, ref: React.RefObject<HTMLDivElement>) => void) | null
}

export default PanelItem