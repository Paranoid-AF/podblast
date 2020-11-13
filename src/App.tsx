import React, { Component } from 'react'
import Navi from './Navi'
import './App.less'

class App extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Navi />
        <div className="container">
          
        </div>
      </div>
    )
  }
}

export default App