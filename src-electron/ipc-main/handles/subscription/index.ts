import type { IpcMainInvokeEvent } from 'electron'

interface SubscriptionAction {
  type: string,
  payload?: any
}

export const subscription = async (event: IpcMainInvokeEvent, action: SubscriptionAction) => {
  switch(action.type) {

  }
}