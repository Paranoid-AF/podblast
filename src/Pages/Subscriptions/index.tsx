import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useCallback, useState } from 'react'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription'
import SubscriptionList from './SubscriptionList'

function Subscriptions() {
  const [newSubModalVisible, setNewSubModalVisible] = useState(false)
  const handleNewSubShow = useCallback(() => {
    setNewSubModalVisible(true)
  }, [setNewSubModalVisible])
  const handleNewSubCancel = useCallback(() => {
    setNewSubModalVisible(false)
  }, [setNewSubModalVisible])
  return (
    <PageBase title="Subscriptions">
      <div className="subs-toolbar">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNewSubShow}>
            Add
          </Button>
        </div>
      </div>
      <NewSubscription isOpen={newSubModalVisible} onClose={handleNewSubCancel} />
      <SubscriptionList />
    </PageBase>
  )
}

export default Subscriptions