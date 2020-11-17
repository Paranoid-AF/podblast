import { Platforms } from '../../../common/constants/os'
import { store } from '../../rematch'
const events: Record<string, (...args: Array<any>) => void> = {}

events["maximize_main"] = () => {
  store.dispatch.appWindow.setMaximizeState(true)
}

events["restore_main"] = () => {
  store.dispatch.appWindow.setMaximizeState(false)
}

events["ready_main"] = (event, info: { isMaximized: boolean, platform: Platforms }) => {
  store.dispatch.appWindow.init({
    maximized: info.isMaximized,
    platform: info.platform
  })
}

export default events