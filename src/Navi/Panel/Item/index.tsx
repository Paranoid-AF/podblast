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
    hidden: this.props.hidden,
    tooltip: false
  }

  itemRef: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidUpdate() {
    this.props.setRef(this.props.id, this.itemRef)
  }

  handleTooltip = (visible: boolean )=> {
    this.setState(() => ({
      tooltip: this.props.tooltip && !this.props.dragged && visible
    }))
  }

  renderActiveIndicator = () => {
    if(this.props.active) {
      return (
        <div className="panel-item-active">
          <div className="panel-item-active-indicator"></div>
        </div>
      )
    }
  }

  processMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if(typeof this.props.onMouseDown === "function") {
      this.props.onMouseDown(e, this.props.id)
      this.setState(() => ({
        tooltip: false
      }))
    }
  }

  processClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if(typeof this.props.onClick === "function") {
      this.props.onClick(e, this.props.id)
    }
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
    const itemStyle: ItemStyle = {
      backgroundColor: this.props.color
    }
    if("image" in this.props) {
      itemStyle.backgroundImage = `url(${this.props.image})`
    }
    return (
      <Tooltip placement="right" title={<span>{this.props.name}</span>} onVisibleChange={this.handleTooltip} visible={this.state.tooltip}>
        <div className="panel-item-wrapper">
          <div ref={this.itemRef} className={ this.props.dragged ? "panel-item panel-item-drag" : "panel-item panel-item-visible" } style={ itemStyle } onMouseDown={this.processMouseDown} onClick={this.processClick}>
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
      </Tooltip>
    )
  }
}

interface ItemStyle {
  backgroundColor: string,
  backgroundImage?: string
}

type State = {
  color?: string,
  hidden?: boolean,
  tooltip?: boolean
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
  setRef: (key: string, ref: React.RefObject<HTMLDivElement>) => void
}

export default PanelItem