import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Platforms } from './common/constants/os'
import { Provider } from 'react-redux'
import { store } from './common/rematch'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

window.electron.on('maximize_main', () => {
  console.log("The App window is maximized!")
})

window.electron.on('ready_main', (event, info: Platforms) => {
  console.log(info, Platforms)
})