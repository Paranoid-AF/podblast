import React, { Component } from 'react'
import { Tooltip } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import './index.less'

class PanelItem extends Component <Props, State> {
  static defaultProps = {
    color: "transparent",
    opacityOnInactive: 1,
    useRoundedCorners: true,
    hidden: false,
    tooltip: true,
    active: false,
    dragged: false,
    onMouseDown: null,
    extraButtonIcon: null,
    extraButtonIconStyle: "outlined",
    removeRef: null,
    setRef: null
  }
  
  state = {
    tooltip: false,
    pressed: false,
    showButton: false
  }

  itemRef: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount() {
    this.sendRef()
  }

  componentDidUpdate() {
    this.sendRef()
  }
  
  componentWillUnmount() {
    if(typeof this.props.removeRef === "function") {
      this.props.removeRef(this.props.id)
    }
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
      pressed: true,
      showButton: false
    })
  }

  processClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(typeof this.props.onClick === "function") {
      this.props.onClick(e, this.props.id)
    }
  }

  onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      pressed: false
    })
  }

  onMouseEnter = () => {
    if(!this.props.dragged) {
      this.setState({
        showButton: true
      })
    }
  }

  onMouseLeave = () => {
    this.setState({
      showButton: false,
      pressed: false,
    })
  }

  onButtonMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
  }

  renderFinal() {
    const itemStyle: ItemStyle = {
      backgroundColor: this.props.color
    }
    if("image" in this.props && this.props.image !== undefined) {
      itemStyle.backgroundImage = `url(${this.props.image})`
    }
    if(this.props.opacityOnInactive < 1 && !this.props.active) {
      itemStyle.opacity = this.props.opacityOnInactive
    }
    let itemClassName = this.props.dragged ? "panel-item panel-item-drag" : "panel-item panel-item-visible"
    if(this.state.pressed) {
      itemClassName += " panel-item-pressed"
    }
    if(!this.props.useRoundedCorners) {
      itemClassName += " no-rounded-corners"
    }
    return (
    <div className="panel-item-wrapper">
      <div ref={this.itemRef}
           className={itemClassName}
           style={ itemStyle }
           onMouseDown={this.processMouseDown}
           onClick={this.processClick}
           onMouseUp={this.onMouseUp}
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
           onContextMenu={this.processClick}
      >
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
  backgroundImage?: string,
  opacity?: number
}

type State = {
  tooltip?: boolean,
  pressed: boolean,
  showButton: boolean
}

type Props = {
  name: string,
  id: string,
  color: string,
  opacityOnInactive: number,
  useRoundedCorners: boolean,
  image?: string,
  hidden?: boolean,
  tooltip?: boolean,
  active?: boolean,
  dragged?: boolean,
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => void,
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => void,
  setRef?: ((key: string, ref: React.RefObject<HTMLDivElement>) => void) | null,
  removeRef?: (key: string) => void | null
}

export default PanelItem