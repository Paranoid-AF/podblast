import { globalOverride, userOverride } from './override'
import { AllConfig, defaultConfig } from './subject'
import { updateConfig } from '../ipc-main/events/confmgr'
import { connection } from '../data'
import { ConfigStore } from '../data/entity/ConfigStore'

const currentConfig: Partial<AllConfig> = { }

export async function fetchConfig() {
  const dbContent: Record<string, any> = { }
  if(connection.current) {
    const result = await connection.current.getRepository(ConfigStore).find()
    result.forEach(val => {
      const key = val.key as keyof AllConfig
      dbContent[key] = JSON.parse(val.value).value
    })
  }
  Object.assign(currentConfig, {
    ...defaultConfig,
    ...dbContent,
    ...globalOverride,
    ...userOverride
  }) 
}

export const config = new Proxy(currentConfig, 
  {
    set: (obj, prop, val) => {
      if(typeof prop !== 'string' || !connection.current) {
        return false
      }
      const targetObj: Record<string, any> = obj
      const newConfigSub = new ConfigStore()
      targetObj[prop] = val
      newConfigSub.key = prop
      newConfigSub.value = JSON.stringify({
        value: val
      })
      connection.current.getRepository(ConfigStore).save(newConfigSub)
      updateConfig(prop as keyof AllConfig, val)
      return true
    }
  }
)

export function getConfigSummary() {
  const result: ConfigSummary = {
    data: config,
    override: Object.keys({
      ...globalOverride,
      ...userOverride
    }) as Array<keyof Partial<AllConfig>>
  }
  return result
}


interface ConfigSummary {
  data: Partial<AllConfig>,
  override: Array<keyof Partial<AllConfig>>
}