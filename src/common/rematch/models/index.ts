import { Models } from '@rematch/core'
import { appWindow } from './window'
import { extension } from './extension'

export interface RootModel extends Models<RootModel> {
  appWindow: typeof appWindow,
  extension: typeof extension
}

export const models: RootModel = { appWindow, extension }