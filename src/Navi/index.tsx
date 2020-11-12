import React, { Component } from 'react'
import './index.less'

import Panel from './Panel'

class Navi extends Component {
  render() {
    return (
      <div className="navi">
        <Panel /><Panel withDivider={false}/>
      </div>
    )
  }
}

export default Navi