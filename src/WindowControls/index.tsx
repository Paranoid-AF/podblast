import React, { Component } from 'react'
import './index.less'
import ControlButton from './Button'

class WindowControls extends Component {
  render() {
    return (
      <div className="window-controls">
        <ControlButton type="close" />
        <ControlButton type="maximize" />
        <ControlButton type="minimize" />
      </div>
    )
  }
}

export default WindowControls