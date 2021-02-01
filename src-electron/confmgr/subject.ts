export const defaultConfig: AllConfig = {
  'network.proxyEnabled': 'disabled'
}

export type AllConfig = (
  FileConfig &
  ProxyConfig
)

export interface FileConfig {
  'file.profileLocation'?: string,
  'file.userDatabaseName'?: string,
}

export interface ProxyConfig {
  'network.proxyEnabled': 'useGlobal' | 'enabled' | 'disabled',
  'network.proxyAddress'?: string
}
