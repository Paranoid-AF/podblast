import React, { Component } from 'react'
import { Tooltip } from 'antd'
import './index.less'

class PanelItem extends Component <Props, State> {
  static defaultProps = {
    color: "#0074aa",
    hidden: false,
    tooltip: true,
    active: false,
    dragged: false
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      hidden: props.hidden,
      tooltip: false
    }
  }

  handleTooltip = (visible: boolean )=> {
    this.setState(prevState => ({
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
          <div className={ this.props.dragged ? "panel-item panel-item-drag" : "panel-item panel-item-visible" } style={ itemStyle }>
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
  color: string,
  image?: string,
  hidden?: boolean,
  tooltip?: boolean,
  active?: boolean,
  dragged?: boolean
}

export default PanelItem