import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'

class App extends Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      fullscreen: false
    }
  }
  render() {
    console.log(this.state.fullscreen)
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