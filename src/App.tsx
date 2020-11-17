import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'
import WindowControls from './WindowControls'
import { listenEvents } from './common/events'

class App extends Component <{}, State> {
  state = {
    borderless: false
  }

  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className={ this.state.borderless ? "container container-borderless" : "container" }>
          <WindowControls />
        </div>
      </div>
    )
  }
}

type Props = { }

type State = {
  borderless: boolean
}

export default App