import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { ModalProps } from 'antd/lib/modal'
import React, { useCallback, useState } from 'react'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription/form'

export default function Subscriptions() {
  const [newSubModalVisible, setNewSubModalVisible] = useState(false)
  const [form, setForm] = useState<FormInstance<any> | null>(null)
  const handleNewSubShow = useCallback(() => {
    setNewSubModalVisible(true)
  }, [setNewSubModalVisible])
  const handleNewSubCancel = useCallback(() => {
    setNewSubModalVisible(false)
    setForm(null)
  }, [setNewSubModalVisible])
  const handleSubmit = useCallback(() => {
    console.log(form?.getFieldsValue())
  }, [form])
  const handleFormChange = useCallback((sourceId: string, provider: string, currentForm: FormInstance<any>) => {
    setForm(currentForm)
  }, [setForm])
  const modalProps: ModalProps & { children?: any } = {
    title: "Add a Subscription",
    visible: newSubModalVisible,
    onOk: handleSubmit,
    onCancel: handleNewSubCancel,
    destroyOnClose: true,
    children: (
      <NewSubscription onFormChange={handleFormChange} />
    )
  }
  if(form === null) {
    modalProps.footer = null
  }
  return (
    <PageBase title="Subscriptions">
      <div className="subs-toolbar">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNewSubShow}>
            Add
          </Button>
        </div>
      </div>
      {
        React.createElement(
          Modal,
          modalProps
        )
      }
    </PageBase>
  )
}

interface Props {

}