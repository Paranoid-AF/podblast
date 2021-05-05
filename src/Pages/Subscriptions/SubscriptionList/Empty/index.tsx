import React from 'react'
import { Empty } from 'antd'
import './index.less'

class SubscriptionListEmpty extends React.PureComponent {
  render() {
    return (
      <div className="sub-empty">
        <Empty
         image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={(
            <span>No subscription.</span>
          )}
        />
      </div>
    )
  }
}

export default SubscriptionListEmpty