import { Models } from '@rematch/core'
import { appWindow } from './window'

export interface RootModel extends Models<RootModel> {
  appWindow: typeof appWindow
}

export const models: RootModel = { appWindow }