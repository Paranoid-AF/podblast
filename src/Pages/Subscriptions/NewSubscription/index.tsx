import { message } from 'antd'
import { FormInstance } from 'antd/lib/form'
import Modal, { ModalProps } from 'antd/lib/modal'
import React, { useCallback, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../../../common/rematch'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { generateURL } from '../../../common/utils/detail-url'
import NewSubscriptionForm from './form'

function NewSubscription(props: Props & DispatchProps & RouteComponentProps) {
  const [form, setForm] = useState<FormInstance<any> | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const sourceInfo = useRef<{ id: string, provider: string } | null>(null)
  const handleClose = useCallback(() => {
    props.onClose()
    setForm(null)
  }, [props])
  const handleSubmit = useCallback(() => {
    if(form) {
      setFormSubmitting(true)
      form.validateFields()
        .then((val) => {
          if(props.beforeSubmit) {
            props.beforeSubmit()
          }
          if(sourceInfo.current) {
            props.submitForm({
              sourceId: sourceInfo.current.id,
              formContent: val,
              provider: sourceInfo.current.provider
            }).then((result) => {
              if(props.afterSubmit) {
                props.afterSubmit()
              }
              handleClose()
              /* Jump to the new subscription detail */
              props.insertTab({ type: 'regular', item: result })
              props.history.push(generateURL({ id: result.uuid }))
            }).catch((info) => {
              message.error("Extension error on postForm.")
              console.error(info)
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
  }, [form, props, handleClose])
  const handleFormChange = useCallback((sourceId: string, provider: string, currentForm: FormInstance<any> | null) => {
    sourceInfo.current = {
      id: sourceId,
      provider: provider
    }
    setForm(currentForm)
  }, [setForm, sourceInfo])
  const modalProps: ModalProps & { children?: any } = {
    title: "Add a Subscription",
    visible: props.isOpen,
    onOk: handleSubmit,
    onCancel: handleClose,
    destroyOnClose: true,
    confirmLoading: formSubmitting,
    maskClosable: false,
    keyboard: false,
    children: (
      <NewSubscriptionForm onFormChange={handleFormChange} />
    )
  }
  if(form === null) {
    modalProps.footer = null
  }
  return React.createElement(
    Modal,
    modalProps
  )
}
interface Props {
  isOpen: boolean,
  onClose: () => void,
  beforeSubmit?: () => void,
  afterSubmit?: () => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  insertTab: dispatch.app.insertTab,
  submitForm: dispatch.subscription.submitSourceForm
})

type DispatchProps = ReturnType<typeof mapDispatch>
export default connect(null, mapDispatch)(withRouter(NewSubscription))