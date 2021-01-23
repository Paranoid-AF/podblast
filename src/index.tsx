import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { store } from './common/rematch'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ConfigProvider autoInsertSpaceInButton={false}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
