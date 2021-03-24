import React, { Fragment, useCallback, useState } from 'react'
import { Dispatch, RootState } from '../../../common/rematch'
import type { FormItem } from '../../../../src-electron/extensions/child-process'
import { Checkbox, Form, Input, message, Radio, Select, Spin } from 'antd';
import { connect } from 'react-redux';

import './index.less'
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

function renderForm(formSchema: Array<FormItem> | null) {
  function wrapItem(form: FormItem, children: JSX.Element, defaultValue: any) {
    return (
      <Form.Item
        key={form.id}
        name={form.id}
        label={form.name}
        rules={[{ required: !form.optional, message: `"${form.name}" is required.` }]}
        required={!form.optional}
        initialValue={defaultValue}
      >
        {children}
      </Form.Item>
    )
  }
  let result: Array<JSX.Element> = []
  if(formSchema && formSchema instanceof Array) {
    result = formSchema.map((form) => {
      if(form.type === 'INPUT') {
        return (
          wrapItem(form, 
            <Input />,
          ''
          )
        )
      }
      if(form.type === 'SELECT') {
        const options: Array<JSX.Element> = []
        let defaultValue
        if(form.field) {
          form.field.forEach(field => {
            if(field.isDefault) {
              defaultValue = field.value
            }
            options.push(
              <Option value={field.value} key={field.value}>
                {field.description}
              </Option>
            )
          })
        }
        return (
          wrapItem(form, 
            <Select placeholder="Select...">
              {options}
            </Select>,
          defaultValue
          )
        )
      }
      if(form.type === 'RADIO') {
        const options: Array<JSX.Element> = []
        let defaultValue
        if(form.field) {
          form.field.forEach(field => {
            if(field.isDefault) {
              defaultValue = field.value
            }
            options.push(
              <Radio key={field.value} value={field.value}>
                {field.description}
              </Radio>
            )
          })
        }
        return (
          wrapItem(form,
            <Radio.Group>
              {options}
            </Radio.Group>,
          defaultValue
          )
        )
      }
      if(form.type === 'CHECK') {
        const options: Array<JSX.Element> = []
        const defaultValue: Array<string> = []
        if(form.field) {
          form.field.forEach(field => {
            if(field.isDefault) {
              defaultValue.push(field.value)
            }
            options.push(
              <Checkbox key={field.value} value={field.value}>
                {field.description}
              </Checkbox>
            )
          })
        }
        return (
          wrapItem(form,
            <Checkbox.Group>
              {options}
            </Checkbox.Group>,
          defaultValue
          )
        )
      }
      return (<Fragment key={form.id} />)
    })
  }
  return result
}

function NewSubscription(props: DispatchProps & StateProps & Props) {
  const [form] = Form.useForm()
  const [currentForm, setCurrentForm] = useState<null | Array<FormItem> | undefined>()
  const [formLoading, setFormLoading] = useState(false)
  const sourceFilter = useCallback((inputValue: string, option?: any) => {
    if(
      option.provider.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
      option.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    ) {
      return true
    }
    return false
  }, [])
  const sourceOptions: Array<any> = props.sources.map(val => {
    const providerName = props.extensions.find(extVal => (extVal.id === val.provider))?.name ?? ''
    const key = JSON.stringify({ id: val.id, provider: val.provider })
    return (
      <Option value={key} key={key} name={val.name} provider={providerName}>
        { val.icon && <span className="new-subs-icon" style={{ backgroundImage: `url(${val.icon})` }}></span> }
        {val.name}
        {providerName && <span className="new-subs-provider">{providerName}</span>}
      </Option>
    )
  })
  const handleChange = async (value: string) => {
    const target = JSON.parse(value)
    setFormLoading(true)
    try {
      const formResult = await props.getForm({ sourceId: target.id, provider: target.provider })
      setCurrentForm(formResult)
      props.onFormChange(target.id, target.provider, form)
    } catch(e) {
      message.error('An error occurred while fetching form from source.')
    }
    setFormLoading(false)
  }
  return (
    <div className="new-subs">
      <div className="new-subs-select">
        <Select
          placeholder="Select a source..." 
          style={{ minWidth: '100%' }}
          showSearch
          filterOption={sourceFilter}
          onChange={handleChange}
          disabled={formLoading} // Prevent race when loading form.
        >
          {sourceOptions}
        </Select>
      </div>
      <div className="new-subs-form">
        {
          formLoading ?
          <div className="new-subs-form-loading"><Spin tip="Preparing form..." /></div> :
          <Form form={form} requiredMark={true}>
            {typeof currentForm !== 'undefined' && renderForm(currentForm)}
          </Form>
          }
      </div>
    </div>
  )
}

interface Props {
  onFormChange: (sourceId: string, provider: string, form: FormInstance<any>) => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  getForm: dispatch.extension.getSourceForm
})

type DispatchProps = ReturnType<typeof mapDispatch>

const mapState = (state: RootState) => ({
  extensions: state.extension.extensionList,
  sources: state.extension.sourceList
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState, mapDispatch)(NewSubscription)
