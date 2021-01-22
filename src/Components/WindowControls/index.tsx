import React from 'react'
import './index.less'
import ControlButton from './Button'
import { RootState, Dispatch } from'../../common/rematch'
import { connect } from 'react-redux'

function WindowControls(props: StateProps & DispatchProps) {
  return (
    <div className="window-controlbar">
      <div className="window-controls">
        <ControlButton type="close" focused={props.isFocused} onClick={props.windowControls.close}/>
        {
          props.isMaximized ?
          <ControlButton type="restore" focused={props.isFocused} onClick={props.windowControls.restore}/> :
          <ControlButton type="maximize" focused={props.isFocused} onClick={props.windowControls.maximize}/>
        }
        <ControlButton type="minimize" focused={props.isFocused} onClick={props.windowControls.minimize}/>
      </div>
    </div>
  )
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