interface SubscriptionAction {
  type: string,
  payload?: any
}

export const subscription = async (event: Electron.IpcMainInvokeEvent, action: SubscriptionAction) => {
  switch(action.type) {

  }
}