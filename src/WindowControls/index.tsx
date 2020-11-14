import React, { Component } from 'react'
import './index.less'
import ControlButton from './Button'

class WindowControls extends Component <{}, State> {
  state = {
    isFocused: false
  }
  render() {
    return (
      <div className="window-controls">
        <ControlButton type="close" focused={false} />
        <ControlButton type="maximize" focused={false} />
        <ControlButton type="minimize" focused={false} />
      </div>
    )
  }
}

type State = {
  isFocused: boolean
}

export default WindowControls