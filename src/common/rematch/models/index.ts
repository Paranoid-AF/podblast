import { Models } from '@rematch/core'
import { appWindow } from './window'
import { extension } from './extension'
import { app } from './app'

export interface RootModel extends Models<RootModel> {
  appWindow: typeof appWindow,
  extension: typeof extension,
  app: typeof app
}

export const models: RootModel = { appWindow, extension, app }