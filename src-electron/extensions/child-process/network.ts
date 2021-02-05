import got, { Options } from 'got'
import { extensions } from './'
import ProxyAgent from 'proxy-agent'
import { requestTimeout } from '../../constants/value'

export const wrappedGot = (extensionId: string) => {
  const target = extensions.find(val => val.id === extensionId)
  const proxyType = (target?.config.proxy ?? 'useGlobal') as 'useGlobal' | 'enabled' | 'disabled'
  let proxyAddress = ''
  if(proxyType === 'enabled') {
    proxyAddress = target?.config.proxyAddress ?? ''
  }
  if(proxyType === 'useGlobal') {
    proxyAddress = process.env['globalProxyAddress'] ?? ''
  }
  return async (url: string, options: Options = {}) => {
    if(proxyAddress !== '') {
      const proxyAgent = new ProxyAgent(proxyAddress)
      options = {
        ...options,
        agent: {
          http: proxyAgent,
          https: proxyAgent
        }
      }
    }
    if(!('timeout' in options)) {
      options['timeout'] = requestTimeout
    }
    return await got(url, options)
  }
}