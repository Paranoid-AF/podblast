import React, { Component } from 'react'
import Navi from './Components/Navi'
import './App.less'
import WindowControls from './Components/WindowControls'
import { listenEvents } from './common/events'
import { Platforms } from './common/constants/os'
import { RootState } from'./common/rematch'
import { connect } from 'react-redux'
class App extends Component <StateProps, {}> {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className="container">
          { this.props.platform === Platforms.WINDOWS && <WindowControls /> }
        </div>
      </div>
    )
  }
}
const mapState = (state: RootState) => ({
  platform: state.appWindow.platform
})
type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(App)