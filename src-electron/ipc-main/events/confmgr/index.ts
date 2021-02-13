import mainWindow from '../../../windows/main'
import { getConfigSummary, config } from '../../../confmgr'
import { AllConfig } from '../../../confmgr/subject'
import { sendMessage } from '../common'
const registerEvents = () => {
  if(mainWindow.target !== null) {
    mainWindow.target.on('ready-to-show', () => {
      updateConfig()
    })
  }
}

export function updateConfig(prop?: keyof AllConfig, val?: valueof<AllConfig>) {
  const result = getConfigSummary()
  result.data = (() => {
    const temp: Record<string, any> = { }
    let i: keyof AllConfig
    for(i in result.data) {
      temp[i]= result.data[i] as any
    }
    return temp
  })()
  const tempMerge: Record<string, any> = { }
  if(typeof prop !== 'undefined' && typeof val !== 'undefined') {
    const value: any = val
    tempMerge[prop] = value
  }
  Object.assign(result.data, tempMerge)
  sendMessage('config_update', JSON.stringify(result))
}

type valueof<T> = T[keyof T]

export default registerEvents