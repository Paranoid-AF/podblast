import React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../../common/rematch'
import './index.less'

class SubscriptionList extends React.PureComponent<StateProps & DispatchProps> {
  componentDidMount() {
    this.props.fetchMore()
    this.props.fetchMore()
    this.props.fetchMore()
  }

  render() {
    return (
      <div className="sub-list"></div>
    )
  }
}

const mapState = (state: RootState) => ({
  list: state.subscription.list,
  total: state.subscription.total
})

const mapDispatch = (dispatch: Dispatch) => ({
  fetchMore: () => dispatch.subscription.fetchMore()
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(SubscriptionList)