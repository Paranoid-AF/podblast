import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Platforms } from './common/constants/os'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

window.electron.on('maximize_main', () => {
  console.log("The App window is maximized!")
})

window.electron.on('ready_main', (event, info: Platforms) => {
  console.log(info, Platforms)
})