import React, { Component } from 'react'
import './App.less'
import Routes from './Routes'
import { listenEvents } from './common/events'
import { store } from './common/rematch'
import { Provider } from 'react-redux'

class App extends Component {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <Provider store={store}>
        <div className="app-wrapper">
          <Routes />
        </div>
      </Provider>
    )
  }
}


export default App