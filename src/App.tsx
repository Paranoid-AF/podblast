import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'
import WindowControls from './WindowControls'
import { listenEvents } from './common/events'

class App extends Component {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className="container">
          <WindowControls />
        </div>
      </div>
    )
  }
}

export default App