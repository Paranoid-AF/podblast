import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'

class App extends Component <{}, State> {
  state = {
    borderless: false
  }

  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className={ this.state.borderless ? "container container-borderless" : "container" }>
          
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