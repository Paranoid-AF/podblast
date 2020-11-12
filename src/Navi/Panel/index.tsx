import React, { Component } from 'react'
import './index.less'

import PanelItem from './Item'

class Panel extends Component <Props, {}> {
  static defaultProps = {
    withDivider: true
  }

  renderDivider() {
    if(this.props.withDivider) {
      return (
        <div className="panel-divider-wrapper">
          <div className="panel-divider"></div>
        </div>
      )
    }
  }
  render() {
    return (
      <div className="panel">
        <PanelItem name="华北浪革" color="#888" hidden={true}/>
        <PanelItem name="捕蛇者说" image="https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss" active={true} />
        { this.renderDivider() }
      </div>
    )
  }
}

type Props = {
  withDivider: boolean
}


export default Panel