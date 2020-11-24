import { app } from 'electron'
import path from 'path'
import child_process, { ChildProcess } from 'child_process'
import { v4 as uuidv4 } from 'uuid';
import isDev from 'electron-is-dev'
export let extensionProcess: ChildProcess | null = null
export let sources: Array<SourceInfo> = []
export let extensions: Array<ExtensionInfo> = []

const signature = "extension_call_recv"
const callResolve: Record<string,
  {
    resolve: (...args: any) => any,
    reject: (...args: any) => any
  }> = { }

export const startExtensionProcess = () => {
  const locale = app.getLocale()
  extensionProcess = child_process.fork(path.join(__dirname, './child-process/index.js'), [], {
    env: {
      locale,
      dev: isDev.toString()
    }
  })
  /* Handle response of Promisified requests */
  extensionProcess.on('message', (msg: ResBody) => {
    if(msg.ipcSignature === signature && msg.uuid && msg.uuid in callResolve) {
      if(msg.status === 'success') {
        callResolve[msg.uuid].resolve(msg.payload)
      } else {
        callResolve[msg.uuid].reject(msg.payload)
      }
      delete callResolve[msg.uuid]
    }
  })
  // Test purpose.
  sendReq({
    action: 'ping',
    payload: 'Ping!'
  })
  .then((val: any) => {
    console.log(val)
  })
}

/* Send Promisified requests */
export const sendReq = (reqBody: ReqBody) => {
  const reqId = uuidv4()
  return new Promise((resolve, reject) => {
    callResolve[reqId] = { resolve, reject }

    if(extensionProcess) {
      extensionProcess.send({
        action: reqBody.action,
        payload: reqBody.payload,
        ipcSignature: signature,
        uuid: reqId
      } as ReqBody)
    }

    setTimeout(() => {
      if(reqId in callResolve) {
        reject(new Error("Time out."))
      }
    }, 10000)
  })
}

export interface ReqBody {
  action: string,
  payload: any,
  ipcSignature?: string,
  uuid?: string
}

export interface ResBody {
  uuid: string,
  status: 'success' | 'failed',
  payload: any,
  ipcSignature: string
}

export interface ExtensionInfo {
  id: string,
  name: string,
  version: string,
  file: string,
  description?: string,
  author?: string,
  homepage?: string
}

export interface SourceInfo {
  id: string,
  name: string,
  description?: string,
  provider: string
}

export interface ExtensionMessage {
  type: 'popup' | 'extensionReady' | 'extensionList' | 'sourceList',
  action?: any
}