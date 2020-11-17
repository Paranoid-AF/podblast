import React, { Component } from 'react'
import './index.less'
import ControlButton from './Button'
import { RootState, Dispatch } from'../common/rematch'
import { connect } from 'react-redux'

class WindowControls extends Component <StateProps & DispatchProps> {
  render() {
    return (
      <div className="window-controls">
        <ControlButton type="close" focused={this.props.isFocused} onClick={this.props.windowControls.close}/>
        {
          this.props.isMaximized ?
          <ControlButton type="restore" focused={this.props.isFocused} onClick={this.props.windowControls.restore}/> :
          <ControlButton type="maximize" focused={this.props.isFocused} onClick={this.props.windowControls.maximize}/>
        }
        <ControlButton type="minimize" focused={this.props.isFocused} onClick={this.props.windowControls.minimize}/>
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  isMaximized: state.appWindow.maximized,
  isFocused: state.appWindow.focused
})

const mapDispatch = (dispatch: Dispatch) => ({
  windowControls: {
    maximize: () => dispatch.appWindow.maximize(),
    minimize: () => dispatch.appWindow.minimize(),
    restore: () => dispatch.appWindow.restore(),
    close: () => dispatch.appWindow.close()
  }
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(WindowControls)