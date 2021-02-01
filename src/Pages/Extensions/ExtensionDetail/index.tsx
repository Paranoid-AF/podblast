import React from 'react'
import { Button, Modal } from 'antd'

import { ExtensionInfo } from '../../../common/rematch/models/extension'
import './index.less'
import { connect } from 'react-redux'
import { RootState, Dispatch } from '../../../common/rematch'

function ExtensionDetail(props: Props & StateProps & DispatchProps) {
  let viewPathButton: JSX.Element | null = null
  let homepageLink: JSX.Element | null = null
  if(props.extension) {
    if(typeof props.extension.file !== 'undefined' && props.extension.type !== 'INTERNAL') {
      const filePath = props.extension.file
      viewPathButton = (
        <Button size="small" type="link" onClick={() => { props.openExplorer(filePath) }}>Show Files</Button>
      )
    }
    if(typeof props.extension.homepage !== 'undefined') {
      homepageLink = (
        <a href={props.extension?.homepage ?? '#'} target="_blank" rel="noopener noreferrer">Open</a>
      )
    }
  }

  return (
    <Modal title="Extension Detail" visible={props.extension !== null} footer={null} onCancel={props.closeDetailView}>
      <div className="extension-info">
        <p>
          <span className="type">Name</span>
          <span className="content">{props.extension?.name ?? props.extension?.id}</span>
        </p>
        <p>
          <span className="type">Identifier</span>
          <span className="content">{props.extension?.id}</span>
        </p>
        <p>
          <span className="type">Version</span>
          <span className="content">{props.extension?.version}</span>
        </p>
        <p>
          <span className="type">Author</span>
          <span className="content">{props.extension?.author ?? '<Not Provided>'}</span>
        </p>
        <p>
          <span className="type">Homepage</span>
          <span className="content">{props.extension?.homepage ?? '<Not Provided>'} {homepageLink}</span>
        </p>
        <p>
          <span className="type">Description</span>
          <span className="content">{props.extension?.description ?? '<Not Provided>'}</span>
        </p>
        <p>
          <span className="type">File Path</span>
          <span className="content">
            {props.extension?.file}
            { viewPathButton }
          </span>
        </p>
        <p>
          <span className="type">Entry Point</span>
          <span className="content">{props.extension?.entry}</span>
        </p>
        <p>
          <span className="type">Active Sources</span>
          <span className="content">
            {
              props.sources.map(val => {
                if(val.provider === props.extension?.id) {
                  return (
                    <p key={val.id}>
                      {val.name} ({val.id})
                    </p>
                  )
                } else {
                  return null
                }
              })
            }
          </span>
        </p>
      </div>
    </Modal>
  )
}

const mapState = (state: RootState) => ({
  sources: state.extension.sourceList
})

const mapDispatch = (dispatch: Dispatch) => ({
  openExplorer: dispatch.appWindow.openExplorer
})

type DispatchProps = ReturnType<typeof mapDispatch>
type StateProps = ReturnType<typeof mapState>


interface Props {
  extension: ExtensionInfo | null,
  closeDetailView: () => void
}



export default connect(mapState, mapDispatch)(ExtensionDetail)