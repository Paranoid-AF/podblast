import React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../../common/rematch'
import './index.less'
import Item from './Item'
class SubscriptionList extends React.PureComponent<StateProps & DispatchProps> {
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
                <Item key={item.uuid} {...itemCopy} />
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
  allLoaded: state.subscription.allLoaded
})

const mapDispatch = (dispatch: Dispatch) => ({
  fetchMore: dispatch.subscription.fetchMore,
  setPage: dispatch.subscription.setPage
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(SubscriptionList)