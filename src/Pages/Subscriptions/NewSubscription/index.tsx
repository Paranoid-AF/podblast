import { message } from 'antd'
import { FormInstance } from 'antd/lib/form'
import Modal, { ModalProps } from 'antd/lib/modal'
import React, { useCallback, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../../../common/rematch'
import NewSubscriptionForm from './form'
function NewSubscription(props: Props & DispatchProps) {
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
          if(sourceInfo.current) {
            props.submitForm({
              sourceId: sourceInfo.current.id,
              formContent: val,
              provider: sourceInfo.current.provider
            }).then((result) => {
              console.log(result) // TODO
              handleClose()
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
  onClose: () => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  submitForm: dispatch.extension.submitSourceForm
})

type DispatchProps = ReturnType<typeof mapDispatch>
export default connect(null, mapDispatch)(NewSubscription)