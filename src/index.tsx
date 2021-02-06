import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { renderPlayer } from './common/player'
import { ConfigProvider } from 'antd'

if(typeof window.electron === 'undefined') {
  window.electron = {
    on: (() => {}) as any,
    invoke: (() => {}) as any,
    isDummy: true
  }
}

if(window.location.hash === '#/player-embedded') {
  renderPlayer()
} else {
  ReactDOM.render(
    <React.StrictMode>
      <ConfigProvider autoInsertSpaceInButton={false}>
        <App />
      </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

