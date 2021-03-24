import { PlusOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { ModalProps } from 'antd/lib/modal'
import React, { useCallback, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../../common/rematch'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription/form'

function Subscriptions(props: DispatchProps) {
  const [newSubModalVisible, setNewSubModalVisible] = useState(false)
  const [form, setForm] = useState<FormInstance<any> | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const sourceInfo = useRef<{ id: string, provider: string } | null>(null)
  const handleNewSubShow = useCallback(() => {
    setNewSubModalVisible(true)
  }, [setNewSubModalVisible])
  const handleNewSubCancel = useCallback(() => {
    setNewSubModalVisible(false)
    setForm(null)
  }, [setNewSubModalVisible])
  const handleSubmit = useCallback(() => {
    if(form) {
      setFormSubmitting(true)
      form.validateFields()
        .then((val) => {
          if(sourceInfo.current) {
            props.submitForm({
              sourceId: sourceInfo.current.id,
              formContent: val,
              provider: sourceInfo.current.provider
            }).then((result) => {
              console.log(result) // TODO
              handleNewSubCancel()
            }).catch((info) => {
              message.error("Extension error on postForm.")
            }).finally(() => {
              setFormSubmitting(false)
            })
          } else {
            message.error("Missing source information.")
            setFormSubmitting(false)
          }
        })
        .catch(() => { setFormSubmitting(false) })
    }
  }, [form])
  const handleFormChange = useCallback((sourceId: string, provider: string, currentForm: FormInstance<any>) => {
    sourceInfo.current = {
      id: sourceId,
      provider: provider
    }
    setForm(currentForm)
  }, [setForm, sourceInfo])
  const modalProps: ModalProps & { children?: any } = {
    title: "Add a Subscription",
    visible: newSubModalVisible,
    onOk: handleSubmit,
    onCancel: handleNewSubCancel,
    destroyOnClose: true,
    confirmLoading: formSubmitting,
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

const mapDispatch = (dispatch: Dispatch) => ({
  submitForm: dispatch.extension.submitSourceForm
})

type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(null, mapDispatch)(Subscriptions)