import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useCallback, useState } from 'react'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription'
import SubscriptionList from './SubscriptionList'
class Subscriptions extends React.PureComponent {
  state = {
    newSubModalVisible: false
  }

  handleNewSubShow = () => {
    this.setState({
      newSubModalVisible: true
    })
  }

  handleNewSubCancel = () => {
    this.setState({
      newSubModalVisible: false
    })
  }

  render() {
    return (
    <PageBase title="Subscriptions">
      <div className="subs-toolbar">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={this.handleNewSubShow}>
            Add
          </Button>
        </div>
      </div>
      <NewSubscription isOpen={this.state.newSubModalVisible} onClose={this.handleNewSubCancel} />
      <SubscriptionList />
    </PageBase>
    )
  }
}

export default Subscriptions