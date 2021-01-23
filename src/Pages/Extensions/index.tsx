import React, { useState } from 'react'
import { Tabs } from 'antd'
import { RootState } from'../../common/rematch'
import { connect } from 'react-redux'

import './index.less'

import ExtensionDetail from './ExtensionDetail'
import PageBase from '../../Components/PageBase'
import ExtensionItem from './ExtensionItem'
import { ExtensionInfo } from '../../common/rematch/models/extension'

const { TabPane } = Tabs

function Extensions(props: StateProps) {
  const [ detailView, setDetailView ] = useState<ExtensionInfo | null>(null)

  const externalExtensions = props.extensions.filter(val => val.type === 'EXTERNAL')
  const internalExtensions = props.extensions.filter(val => val.type === 'INTERNAL')

  const showDetail = (target: ExtensionInfo) => {
    setDetailView(target)
  }

  const closeDetailView = () => {
    setDetailView(null)
  }

  return (
    <PageBase title="Extensions">
      <div className="extension-container">
        <Tabs>
          <TabPane tab="Installed" key="1">
            <div className="extension-list">
              {
                externalExtensions.map(val => (
                  <ExtensionItem key={val.id} extension={val} showExtensionDetail={showDetail} />
                ))
              }
            </div>
          </TabPane>
          <TabPane tab="Internal" key="2">
            <div className="extension-list">
              {
                internalExtensions.map(val => (
                  <ExtensionItem key={val.id} extension={val} showExtensionDetail={showDetail} />
                ))
              }
            </div>
          </TabPane>
        </Tabs>
        <ExtensionDetail extension={detailView} closeDetailView={closeDetailView} />
      </div>
    </PageBase>
  )
}

const mapState = (state: RootState) => ({
  extensions: state.extension.extensionList
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(Extensions)