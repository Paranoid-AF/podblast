import React, { useCallback, useState } from 'react'
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

  const showDetail = useCallback((target: ExtensionInfo) => {
    setDetailView(target)
  }, [])

  const closeDetailView = useCallback(() => {
    setDetailView(null)
  }, [])

  const renderEnabledList = useCallback((val: ExtensionInfo) => {
    if(val.config.status === 'enabled') {
      return <ExtensionItem key={val.id} extension={val} showExtensionDetail={showDetail} />
    } else {
      return null
    }
  }, [showDetail])

  const renderDisabledList = useCallback((val: ExtensionInfo) => {
    if(val.config.status === 'disabled') {
      return <ExtensionItem key={val.id} extension={val} showExtensionDetail={showDetail} />
    } else {
      return null
    }
  }, [showDetail])

  const renderList = useCallback((rawArray: Array<ExtensionInfo>) => {
    const disabledList = rawArray.map(renderDisabledList)
    return (
      <div className="extension-list">
        { rawArray.map(renderEnabledList) }
        { disabledList.filter(val => val !== null).length > 0 && <h3>Disabled</h3> }
        { disabledList }
      </div>
    )
  }, [renderDisabledList, renderEnabledList])

  return (
    <PageBase title="Extensions">
      <div className="extension-container">
        <Tabs>
          <TabPane tab="Installed" key="1">
            { renderList(externalExtensions) }
          </TabPane>
          <TabPane tab="Internal" key="2">
            { renderList(internalExtensions) }
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