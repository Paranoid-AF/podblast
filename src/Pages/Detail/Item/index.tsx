import React from 'react'
// import PageBase from '../../../Components/PageBase'

import type { Subscription } from '../../../../src-electron/data/entity/Subscription'

class DetailItem extends React.PureComponent<Props & Subscription> {
  render() {
    return (
      <div>
        {this.props.title} / {this.props.visible.toString()}
      </div>
    )
  }
}

interface Props {
  visible: boolean
}

export default DetailItem