import { Models } from '@rematch/core'
import { appWindow } from './window'
import { extension } from './extension'
import { app } from './app'
import { player } from './player'
import { subscription } from './subscription'

export interface RootModel extends Models<RootModel> {
  appWindow: typeof appWindow,
  extension: typeof extension,
  app: typeof app,
  player: typeof player,
  subscription: typeof subscription
}

export const models: RootModel = {
  appWindow,
  extension,
  app,
  player,
  subscription,
}