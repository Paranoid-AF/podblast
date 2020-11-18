import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'
import WindowControls from './WindowControls'
import { listenEvents } from './common/events'
import { RootState } from'./common/rematch'
import { connect } from 'react-redux'
import { Platforms } from './common/constants/os'

class App extends Component <StateProps> {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className={ this.props.maximized ? "container container-borderless" : "container" }>
          <WindowControls />
        </div>
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  maximized: state.appWindow.maximized
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(App)