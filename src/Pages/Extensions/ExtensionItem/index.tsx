import React, { Fragment, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Popconfirm, Switch } from 'antd'
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'

import { Dispatch } from'../../../common/rematch'
import { ExtensionInfo } from '../../../common/rematch/models/extension'

import iconPlaceholder from '../../../common/res/extension-icons/extension-placeholder.png'
import './index.less'

function ExtensionItem(props: Props & DispatchProps) {
  const [ toggling, setToggling ] = useState(false)
  const toggleStatus = useCallback(async () => {
    setToggling(true)
    if(props.extension.config.status === 'enabled') {
      await props.disableExtension(props.extension.id)
    }
    if(props.extension.config.status === 'disabled') {
      await props.enableExtension(props.extension.id)
    }
    setToggling(false)
  }, [ props ])

  const icon = props.extension.icon ?? iconPlaceholder

  let authorLink: JSX.Element | string | null = null
  if(props.extension.author) {
    if(props.extension.homepage) {
      authorLink = (
        <Fragment>by <a href={props.extension.homepage} target="_blank" rel="noopener noreferrer">{props.extension.author}</a></Fragment>
      )
    } else {
      authorLink = (
        <Fragment>by {props.extension.author}</Fragment>
      )
    }
  }

  let operations: JSX.Element | null = null
  if(props.extension.type === 'EXTERNAL') {
    operations = (
      <Fragment>
        <Popconfirm
          title={`Remove extension "${props.extension.name}" and its data from Podchat?`}
          onConfirm={() => { props.removeExtension(props.extension.id) }}
          okText="Remove"
          cancelText="Cancel"
        >
          <Button><DeleteOutlined /> Remove</Button>
        </Popconfirm>
      </Fragment>
    )
  }

  return (
    <div className="extension-item">
      <img className="extension-icon" src={icon} alt={"Extension icon of " + props.extension.name} />
      <div className="extension-detail">
        <p className="extension-name">{props.extension.name}</p>
        <p className="extension-author">{authorLink}</p>
        <p className="extension-description">{props.extension.description}</p>
        <p className="extension-version">Version: {props.extension.version}</p>
        <div className="extension-switch">
          <Switch onChange={toggleStatus} checked={props.extension.config.status === 'enabled'} loading={toggling} />
        </div>
        <div className="extension-control">
          <Button onClick={() => { props.showExtensionDetail(props.extension) }}><InfoCircleOutlined /> Detail</Button>
          {operations}
        </div>
      </div>
    </div>
  )
}

interface Props {
  extension: ExtensionInfo,
  showExtensionDetail: (target: ExtensionInfo) => void
}

const mapDispatch = (dispatch: Dispatch) => ({
  removeExtension: dispatch.extension.removeExtension,
  enableExtension: dispatch.extension.enableExtension,
  disableExtension: dispatch.extension.disableExtension
})

type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(null, mapDispatch)(ExtensionItem)