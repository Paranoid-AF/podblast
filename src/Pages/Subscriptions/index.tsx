import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import PageBase from '../../Components/PageBase'
import './index.less'
import NewSubscription from './NewSubscription'
import SubscriptionList from './SubscriptionList'
import { RouteComponentProps, withRouter } from 'react-router-dom'
class Subscriptions extends React.PureComponent<RouteComponentProps> {
  state = {
    newSubModalVisible: false
  }
  containerRef = React.createRef<HTMLDivElement>()
  containerScroll = 0
  shouldScroll = false

  handleNewSubShow = () => {
    this.setState({
      newSubModalVisible: true
    })
  }

  handleNewSubCancel = () => {
    this.setState({
      newSubModalVisible: false
    })
  }

  handlePreSubmit = () => {
    const current = this.containerRef.current
    if(current) {
      this.containerScroll = current.scrollTop
    }
  }

  handlePostSubmit = () => {
    this.shouldScroll = true
  }

  postContainerUpdate = () => {
    if(this.shouldScroll) {
      const current = this.containerRef.current
      if(current && current.scrollTop !== this.containerScroll) {
        const selfCheck = setInterval(() => {
          if(current.scrollHeight >= this.containerScroll) {
            current.scrollTo({
              top: this.containerScroll
            })
            clearInterval(selfCheck)
          }
        }, 100)
        this.shouldScroll = false
      }
    }
  }

  render() {
    return (
    <PageBase
      title="Subscriptions"
      innerRef={this.containerRef}
      afterUpdate={this.postContainerUpdate}
      visible={this.props.location.pathname === '/subscriptions'}
    >
      <div className="subs-toolbar">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={this.handleNewSubShow}>
            Add
          </Button>
        </div>
      </div>
      <NewSubscription
        isOpen={this.state.newSubModalVisible}
        onClose={this.handleNewSubCancel}
        beforeSubmit={this.handlePreSubmit}
        afterSubmit={this.handlePostSubmit}
      />
      <SubscriptionList />
    </PageBase>
    )
  }
}

export default withRouter(Subscriptions)