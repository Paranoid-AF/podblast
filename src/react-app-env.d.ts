/// <reference types="react-scripts" />

declare global {
  function lang(localeString: string, replaceStrings?: string[]): string[];
  function lang(localeString: string, replaceStrings?: Array<string | React.ComponentType | JSX.Element>): Array<string | React.ComponentType | JSX.Element>
  interface Window {
    electron: {
      invoke: (channel: string, content: InvokeAction) => Promise<IpcMessage>,
      on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void,
      isDummy?: boolean
    },
    lang: typeof lang,
  }
  
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