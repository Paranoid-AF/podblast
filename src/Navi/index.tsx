import React, { Component } from 'react'
import './index.less'

import Panel from './Panel'

class Navi extends Component <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      borderless: false
    }
  }
  render() {
    return (
      <div className={ this.state.borderless ? "navi navi-borderless" : "navi" }>
        <Panel />
      </div>
    )
  }
}

type Props = { }

type State = {
  borderless: boolean
}


export default Navi