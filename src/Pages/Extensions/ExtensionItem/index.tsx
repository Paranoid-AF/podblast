import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'

import { Dispatch } from'../../../common/rematch'
import { ExtensionInfo } from '../../../common/rematch/models/extension'

import iconPlaceholder from '../../../common/res/extension-icons/extension-placeholder.png'
import './index.less'

function ExtensionItem(props: Props & DispatchProps) {
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
        <Button onClick={() => { props.removeExtension(props.extension.id) }}>Remove</Button>
      </Fragment>
    )
  }

  return (
    <div className="extension-item">
      <img className="extension-icon" src={icon} />
      <div className="extension-detail">
        <p className="extension-name">{props.extension.name}</p>
        <p className="extension-author">{authorLink}</p>
        <p className="extension-description">{props.extension.description}</p>
        <p className="extension-version">Version: {props.extension.version}</p>
        <div className="extension-control">
          <Button onClick={() => { props.showExtensionDetail(props.extension) }}>Detail</Button>
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
  removeExtension: dispatch.extension.removeExtension
})

type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(null, mapDispatch)(ExtensionItem)