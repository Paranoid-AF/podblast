import React, { Component } from 'react'
import './index.less'

import Panel from './Panel'

class Navi extends Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      fullscreen: true // TODO: Always true on Linux, but works on Windows.
    }
  }
  render() {
    return (
      <div className={ this.state.fullscreen ? "navi navi-fullscreen" : "navi" }>
        <Panel />
      </div>
    )
  }
}

type State = {
  fullscreen: boolean
}

type Props = { }

export default Navi