/// <reference types="react-scripts" />
import type { Props as LocaleProps } from './common/utils/magic-locale'

declare global {
  interface Window {
    electron: {
      invoke: (channel: string, content: InvokeAction) => Promise<IpcMessage>,
      on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void,
      isDummy?: boolean
    },
    l: (localeString: string) => string,
    Locale: React.FunctionComponent<Omit<LocaleProps, 'language'>>,
  }

  declare const l: typeof window['l']
  declare const Locale: typeof window['Locale']

}

interface IpcMessage {
  status: 'error' | 'success',
  info?: string,
  data?: any
}

export interface appWindowPayload {
  action: 'close' | 'minimize' | 'maximize' | 'restore'
}

interface InvokeAction {
  type: string,
  payload?: any
}