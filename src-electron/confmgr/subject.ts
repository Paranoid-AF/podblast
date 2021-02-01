export const defaultConfig: AllConfig = {
  'ui.darkMode': 'auto'
}

export type AllConfig = (
  FileConfig &
  UIConfig
)

export interface FileConfig {
  'file.profileLocation'?: string,
  'file.userDatabaseName'?: string,
}

export interface UIConfig {
  'ui.darkMode': 'auto' | 'light' | 'dark'
}
