export const defaultConfig: AllConfig = {
  'network.proxyEnabled': 'disabled',
  'player.volume': 0.6
}

export type AllConfig = (
  FileConfig &
  ProxyConfig &
  PlayerConfig
)

export interface PlayerConfig {
  'player.volume': number
}

export interface FileConfig {
  'file.profileLocation'?: string,
  'file.userDatabaseName'?: string,
}

export interface ProxyConfig {
  'network.proxyEnabled': 'useGlobal' | 'enabled' | 'disabled',
  'network.proxyAddress'?: string
}
