import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'
import WindowControls from './WindowControls'

class App extends Component <{}, State> {
  state = {
    borderless: false
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