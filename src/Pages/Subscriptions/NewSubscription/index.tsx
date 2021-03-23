import React, { useCallback, useState } from 'react'
import { Dispatch, RootState } from '../../../common/rematch'
import type { FormItem, SourceResult } from '../../../../src-electron/extensions/child-process'
import { Select, Spin } from 'antd';
import { connect } from 'react-redux';

import './index.less'

const { Option } = Select;

function NewSubscription(props: DispatchProps & StateProps) {
  const [currentForm, setCurrentForm] = useState<null | Array<FormItem>>(null)
  const [formLoading, setFormLoading] = useState(false)
  const sourceFilter = useCallback((inputValue: string, option?: any) => {
    if(
      option.provider.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
      option.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
      option.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    ) {
      return true
    }
    return false
  }, [])
  const sourceOptions: Array<any> = props.sources.map(val => {
    const providerName = props.extensions.find(extVal => (extVal.id === val.provider))?.name ?? ''
    return (
      <Option value={val.id} key={val.id} name={val.name} provider={providerName}>
        { val.icon && <span className="new-subs-icon" style={{ backgroundImage: `url(${val.icon})` }}></span> }
        {val.name}
        {providerName && <span className="new-subs-provider">{providerName}</span>}
      </Option>
    )
  })
  const handleChange = async (value: string) => {
    setFormLoading(true)
    try {
      const formResult = await props.getForm(value)
      setCurrentForm(formResult)
    } catch(e) {
      setCurrentForm(null)
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
        >
          {sourceOptions}
        </Select>
      </div>
      <div className="new-subs-form">
        {formLoading ? <div className="new-subs-form-loading"><Spin /></div> : JSON.stringify(currentForm)}
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
