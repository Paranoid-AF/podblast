import React from 'react'
import './index.less'
import iconCloseDark from '../../../common/res/window-controls/close-k-30.png'
import iconMaxDark from '../../../common/res/window-controls/max-k-30.png'
import iconMinDark from '../../../common/res/window-controls/min-k-30.png'
import iconRestoreDark from '../../../common/res/window-controls/restore-k-30.png'
import iconCloseLight from '../../../common/res/window-controls/close-w-30.png'
import iconMaxLight from '../../../common/res/window-controls/max-w-30.png'
import iconMinLight from '../../../common/res/window-controls/min-w-30.png'
import iconRestoreLight from '../../../common/res/window-controls/restore-w-30.png'

const defaultProps = {
  color: "dark",
  focused: true
}
const iconSetDark: IconSet = {
  close: iconCloseDark,
  maximize: iconMaxDark,
  minimize: iconMinDark,
  restore: iconRestoreDark
}
const iconSetLight: IconSet = {
  close: iconCloseLight,
  maximize: iconMaxLight,
  minimize: iconMinLight,
  restore: iconRestoreLight
}

function Button(props: Props) {
  const mixedProps = {
    ...defaultProps,
    ...props
  }
  let currentIconSet = mixedProps.color === 'dark' ? iconSetDark : iconSetLight
  let icon = ""
  switch(mixedProps.type) {
    case 'close':
      icon = currentIconSet.close
      break
    case 'maximize':
      icon = currentIconSet.maximize
      break
    case 'minimize':
      icon = currentIconSet.minimize
      break
    case 'restore':
      icon = currentIconSet.restore
  }

  const title = mixedProps.type.toUpperCase().substring(0, 1) + mixedProps.type.substring(1)

  return (
    <div title={title} className={`window-controll-button window-controll-button-${mixedProps.type}${mixedProps.focused ? "" : " window-controll-button-defocused"}`} onClick={props.onClick}>
      <div className="window-controll-icon">
        <img
          src={icon}
          draggable="false"
          alt={title}
        />
      </div>
    </div>
  )
}

type Props = {
  type: "close" | "maximize" | "restore" | "minimize",
  color?: "light" | "dark",
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  focused?: boolean
}

type IconSet = {
  close: string,
  maximize: string,
  restore: string,
  minimize: string
}

export default Button