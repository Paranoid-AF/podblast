import { contextBridge } from 'electron';

import { appWindow } from './window'

contextBridge.exposeInMainWorld(
  'electron',
  {
    appWindow
  }
)