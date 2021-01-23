import React from 'react'
import { Tabs } from 'antd'
import { RootState, Dispatch } from'../../common/rematch'
import { connect } from 'react-redux'

import './index.less'

import PageBase from '../../Components/PageBase'
import ExtensionItem from './ExtensionItem'

const { TabPane } = Tabs

function Extensions(props: StateProps & DispatchProps) {
  const externalExtensions = props.extensions.filter(val => val.type === 'EXTERNAL')
  const internalExtensions = props.extensions.filter(val => val.type === 'INTERNAL')
  console.log(props.extensions)
  return (
    <PageBase title="Extensions">
      <div className="extension-container">
        <Tabs>
          <TabPane tab="Installed" key="1">
            <div className="extension-list">
              {
                externalExtensions.map(val => (
                  <ExtensionItem key={val.id} extension={val} />
                ))
              }
            </div>
          </TabPane>
          <TabPane tab="Internal" key="2">
            <div className="extension-list">
              {
                internalExtensions.map(val => (
                  <ExtensionItem key={val.id} extension={val} />
                ))
              }
            </div>
          </TabPane>
        </Tabs>
      </div>
    </PageBase>
  )
}

const mapState = (state: RootState) => ({
  extensions: state.extension.extensionList,
  sources: state.extension.sourceList
})

const mapDispatch = (dispatch: Dispatch) => ({
  windowControls: {
    maximize: () => dispatch.appWindow.maximize(),
    minimize: () => dispatch.appWindow.minimize(),
    restore: () => dispatch.appWindow.restore(),
    close: () => dispatch.appWindow.close()
  }
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(Extensions)