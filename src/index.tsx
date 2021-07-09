import React from 'react';
import ReactDOM from 'react-dom';
import './common/utils/electron-fallback';
import './common/utils/magic-locale';
import './index.css';
import App from './App';
import { renderPlayer } from './common/player'
import { ConfigProvider } from 'antd'
import 'antd/dist/antd.less';

if(window.location.hash === '#/player-embedded') {
  renderPlayer()
} else {
  const rootNode = document.getElementById('root')
  if(rootNode) {
    ReactDOM.render(
      <React.StrictMode>
        <ConfigProvider autoInsertSpaceInButton={false}>
          <App />
        </ConfigProvider>
      </React.StrictMode>,
      rootNode
    )
  }
}

