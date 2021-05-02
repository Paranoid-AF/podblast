import React from 'react'
import './App.less'
import Routes from './Routes'
import { listenEvents } from './common/events'
import { store } from './common/rematch'
import { Provider } from 'react-redux'
import PlayControl from './Components/PlayControl'
import NowPlaying from './Pages/NowPlaying'

class App extends React.PureComponent {
  componentDidMount() {
    listenEvents()
  }

  render() {
    return (
      <Provider store={store}>
        <div className="app-wrapper">
          <Routes />
          <NowPlaying />
          <PlayControl />
        </div>
      </Provider>
    )
  }
}


export default App