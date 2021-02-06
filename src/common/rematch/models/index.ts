import { Models } from '@rematch/core'
import { appWindow } from './window'
import { extension } from './extension'
import { app } from './app'
import { player } from './player'

export interface RootModel extends Models<RootModel> {
  appWindow: typeof appWindow,
  extension: typeof extension,
  app: typeof app,
  player: typeof player
}

export const models: RootModel = { appWindow, extension, app, player }