import React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../../common/rematch'
import './index.less'
import Item from './Item'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { generateURL } from '../../../common/utils/detail-url'

import type {
  Subscription,
} from '../../../../src-electron/data/entity/Subscription'

import { MenuActions } from './Item'
import { Modal } from 'antd'

class SubscriptionList extends React.PureComponent<StateProps & DispatchProps & RouteComponentProps> {
  loadMoreRef = React.createRef<HTMLDivElement>()
  intersectionObserver: IntersectionObserver | null = null
  keepLoading = false

  async loadMore() {
    const { allLoaded, page, setPage } = this.props
    if(!allLoaded) {
      await this.props.fetchMore({ page })
      await setPage(page + 1)
      if(this.keepLoading) {
        await this.loadMore()
      }
    }
  }

  registerIntersection() {
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      const target = entries.find(item => (item.target === this.loadMoreRef.current))
      if(target) {
        if(target.isIntersecting) {
          this.keepLoading = true
          this.loadMore()
        } else {
          this.keepLoading = false
        }
      }
    })
  }

  componentDidMount() {
    this.registerIntersection()
    if(this.loadMoreRef.current) {
      this.intersectionObserver?.observe(this.loadMoreRef.current)
    }
  }

  getSourceNameById(id: string) {
    const sourceInfo = this.props.sourceList.find((element) => ( element.id === id ))
    if(sourceInfo) {
      return sourceInfo.name
    } else {
      return ''
    }
  }

  handleClick = (info: Subscription) => {
    const { createTab, history, tabIds } = this.props
    if(!tabIds.has(info.uuid)) {
      createTab({
        type: 'regular',
        item: info
      })
    }
    history.push(generateURL({ id: info.uuid }))
  }

  handleRemoveItem = (item: Subscription) => {
    console.log('Removing sub: '+item.uuid)
  }

  handleContextMenu = (item: Subscription, action: MenuActions) => {
    switch(action) {
      case MenuActions.OPEN: {
        this.handleClick(item)
        break
      }
      case MenuActions.PIN_TO_SIDEBAR: {
        this.props.pinSubscription(item.uuid)
        break
      }
      case MenuActions.REMOVE: {
        Modal.confirm({
          title: 'Remove Subscription',
          content: (
            <span>
              <p>You're about to remove the following subscription.</p>
              <p>
                Name: {item.title} <br/>
                Source: {item.source}
              </p>
              <p>This operation may not be reverted.</p>
            </span>
          ),
          okText: 'Remove',
          onOk: () => {this.handleRemoveItem(item)},
          okButtonProps: {
            danger: true
          }
        })
        break
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="sub-list">
          {
            this.props.list.map(item => {
              const itemCopy = {
                ...item,
                source: this.getSourceNameById(item['source'])
              }
              return (
                <Item key={item.uuid} onClick={this.handleClick} onContextMenu={this.handleContextMenu} {...itemCopy} />
              )
            })
          }
        </div>
        <div className="sub-loadmore" ref={this.loadMoreRef}></div>
      </React.Fragment>
    )
  }
}

const mapState = (state: RootState) => ({
  list: state.subscription.list,
  total: state.subscription.total,
  sourceList: state.extension.sourceList,
  page: state.subscription.page,
  allLoaded: state.subscription.allLoaded,
  tabIds: state.app.tabIds
})

const mapDispatch = (dispatch: Dispatch) => ({
  fetchMore: dispatch.subscription.fetchMore,
  setPage: dispatch.subscription.setPage,
  createTab: dispatch.app.insertTab,
  pinSubscription: dispatch.subscription.pinSubscription
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(withRouter(SubscriptionList))