import React, { Fragment, useCallback, useState } from 'react'
import { Dispatch, RootState } from '../../../common/rematch'
import type { FormItem } from '../../../../src-electron/extensions/child-process'
import { Checkbox, Form, Input, message, Radio, Select, Spin } from 'antd';
import { connect } from 'react-redux';

import './index.less'

const { Option } = Select;

function renderForm(formSchema: Array<FormItem> | null) {
  console.log(formSchema)
  function wrapItem(form: FormItem, children: JSX.Element) {
    return (
      <Form.Item
        key={form.id}
        label={form.name}
        rules={[{ required: !form.optional }]}
        required={!form.optional}
      >
        {children}
      </Form.Item>
    )
  }
  if(formSchema !== null) {
    const result: Array<JSX.Element> = formSchema.map((form) => {
      if(form.type === 'INPUT') {
        return (
          wrapItem(form, 
            <Input />
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
            <Select placeholder="Select..." defaultValue={defaultValue}>
              {options}
            </Select>
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
            <Radio.Group defaultValue={defaultValue}>
              {options}
            </Radio.Group>
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
            <Checkbox.Group defaultValue={defaultValue}>
              {options}
            </Checkbox.Group>
          )
        )
      }
      return (<Fragment key={form.id} />)
    })
    return (
      <Form requiredMark={true}>
        {result}
      </Form>
    )
  } else {
    return []
  }
}

function NewSubscription(props: DispatchProps & StateProps) {
  const [currentForm, setCurrentForm] = useState<null | Array<FormItem>>(null)
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
        {formLoading ? <div className="new-subs-form-loading"><Spin tip="Preparing form..." /></div> : renderForm(currentForm)}
      </div>
    </div>
  )
}

const mapDispatch = (dispatch: Dispatch) => ({
  getForm: dispatch.extension.getSourceForm,
  submitForm: dispatch.extension.submitSourceForm
})

type DispatchProps = ReturnType<typeof mapDispatch>

const mapState = (state: RootState) => ({
  extensions: state.extension.extensionList,
  sources: state.extension.sourceList
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState, mapDispatch)(NewSubscription)
