import React, { Component } from 'react'
import './App.less'
import Routes from './Routes'
import { listenEvents } from './common/events'


class App extends Component {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <div className="app-wrapper">
        <Routes />
      </div>
    )
  }
}


export default App