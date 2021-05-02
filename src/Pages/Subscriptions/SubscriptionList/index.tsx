import React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../../common/rematch'
import './index.less'
import Item from './Item'
class SubscriptionList extends React.PureComponent<StateProps & DispatchProps> {
  componentDidMount() {
    this.props.fetchMore()
    this.props.fetchMore()
    this.props.fetchMore()
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
    )
  }
}

const mapState = (state: RootState) => ({
  list: state.subscription.list,
  total: state.subscription.total,
  sourceList: state.extension.sourceList
})

const mapDispatch = (dispatch: Dispatch) => ({
  fetchMore: () => dispatch.subscription.fetchMore()
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(SubscriptionList)