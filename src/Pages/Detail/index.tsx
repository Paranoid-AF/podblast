import React from 'react'
import { store, RootState } from'../../common/rematch'
import { connect } from 'react-redux'
import type { Unsubscribe } from 'redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import type { Subscription } from '../../../src-electron/data/entity/Subscription'

import { parseURL } from '../../common/utils/detail-url'
import Item from './Item'
import { message } from 'antd'

class DetailRoute extends React.PureComponent<StateProps & RouteComponentProps> {
  pageStorage: Record<string, Subscription> = {}
  currentTabID = ''
  unsubStore: Unsubscribe

  componentDidMount() {
    this.unsubStore = store.subscribe(() => {
      const state = store.getState()
      const { pinned, regular } = state.app.tabs
      const existingTabs = new Set<string>()
      let changed = false;
      [...pinned, ...regular].forEach(item => {
        existingTabs.add(item.uuid)
      })
      for(let key in this.pageStorage) {
        if(!existingTabs.has(key)) {
          changed = true
          delete this.pageStorage[key]
        }
      }
      if(changed) {
        this.forceUpdate()
      }      
    })
  }

  componentWillUnmount() {
    this.unsubStore()
  }

  renderPage(id?: string) {
    if(typeof id === 'string') {
      this.currentTabID = id
      if(!(id in this.pageStorage)) {
        const { tabs } = this.props
        let targetTab
        targetTab = tabs.pinned.find(item => (item.uuid === id))
        if(!targetTab) {
          targetTab = tabs.regular.find(item => (item.uuid === id))    
        }
        if(targetTab) {
          this.pageStorage[id] = targetTab
        } else {
          this.props.history.goBack()
        }
      }
    }
    return Object.values(this.pageStorage).map(item => (
      <Item {...item}
        key={item.uuid}
        visible={id === item.uuid}
      />
    ))
  }

  render() {
    const detailLocation = parseURL(this.props.location)
    return (
      <div style={{ display: detailLocation ? 'block' : 'none' }}>
        {this.renderPage(detailLocation?.id)}
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  tabs: state.app.tabs
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(withRouter(DetailRoute))