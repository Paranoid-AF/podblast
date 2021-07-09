export const defaultConfig: AllConfig = {
  'network.proxyEnabled': 'disabled',
  'player.volume': 0.6,
  'player.forwardTime': 10,
  'player.backwardTime': 5,
  'player.playbackSpeed': 1,
  'app.language': 'en-US',
}

export type AllConfig = (
  FileConfig &
  ProxyConfig &
  PlayerConfig &
  AppConfig
)

export interface PlayerConfig {
  'player.volume': number,
  'player.forwardTime': number,
  'player.backwardTime': number,
  'player.playbackSpeed': number
}

export interface FileConfig {
  'file.profileLocation'?: string,
  'file.userDatabaseName'?: string,
}

export interface ProxyConfig {
  'network.proxyEnabled': 'useGlobal' | 'enabled' | 'disabled',
  'network.proxyAddress'?: string
}

export interface AppConfig {
  'app.language': 'zh-CN' | 'en-US',
}