import React, { Component } from 'react'
import { Tooltip } from 'antd'
import './index.less'

class PanelItem extends Component <Props, State> {
  static defaultProps = {
    color: "#0074aa",
    hidden: false,
    tooltip: true
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
      tooltip: this.props.tooltip && visible
    }))
  }

  render() {
    const itemStyle: ItemStyle = {
      backgroundColor: this.props.color
    }
    if("image" in this.props) {
      itemStyle.backgroundImage = `url(${this.props.image})`
    }
    return (
      <Tooltip placement="right" title={<span>{this.props.name}</span>} onVisibleChange={this.handleTooltip} visible={this.state.tooltip}>
        <div className="panel-item-wrapper">
          <div className="panel-item" style={ itemStyle }>
            {
              !this.props.image && 
              (
                <div className="panel-item-text">
                  { this.props.name.substring(0, 1) }
                </div>
              )
            }
          </div>
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
  tooltip?: boolean
}

export default PanelItem