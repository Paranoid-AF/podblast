import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React, { useCallback, useState } from 'react'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription'

export default function Subscriptions() {
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
            New
          </Button>
        </div>
      </div>
      <Modal title="Create a Subscription" visible={newSubModalVisible} onCancel={handleNewSubCancel} destroyOnClose={true}>
        <NewSubscription />
      </Modal>
    </PageBase>
  )
}

interface Props {

}