import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'

class App extends Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      fullscreen: true // TODO: Always true on Linux, but works on Windows.
    }
  }
  render() {
    return (
      <div className={ this.state.fullscreen ? "app-wrapper app-wrapper-fullscreen" : "app-wrapper"}>
        <Navi />
        <div className={ this.state.fullscreen ? "container container-fullscreen" : "container" }>
          
        </div>
      </div>
    )
  }
}

type State = {
  fullscreen: boolean
}

type Props = { }

export default App