import React from 'react'
import './index.less'
import type {
  Subscription,
} from '../../../../../src-electron/data/entity/Subscription'
import { Menu, Dropdown, Modal } from 'antd';

enum MenuActions {
  OPEN = 'OPEN',
  PIN_TO_SIDEBAR = 'PIN_TO_SIDEBAR',
  REMOVE = 'REMOVE'
}

class SubscriptionListItem extends React.PureComponent<Subscription> {
  handleRemoveItem = () => {
    console.log('Removing sub: '+this.props.uuid)
  }

  handleMenuClick = (event: { key: MenuActions }) => {
    switch(event.key) {
      case MenuActions.OPEN: {
        console.log('Opening...')
        break
      }
      case MenuActions.PIN_TO_SIDEBAR: {
        console.log('Pinned to sidebar...')
        break
      }
      case MenuActions.REMOVE: {
        Modal.confirm({
          title: 'Remove Subscription',
          content: (
            <span>
              <p>You're about to remove the following subscription.</p>
              <p>
                Name: {this.props.title} <br/>
                Source: {this.props.source}
              </p>
              <p>This operation may not be reverted.</p>
            </span>
          ),
          okText: 'Remove',
          onOk: this.handleRemoveItem,
          okButtonProps: {
            danger: true
          }
        })
        break
      }
    }
  }

  renderCover() {
    const style: React.CSSProperties = {}
    if(this.props.cover_color) {
      style.backgroundColor = this.props.cover_color
    }
    if(this.props.cover_pic) {
      style.backgroundImage = `url('${this.props.cover_pic}')`
    }
    return (
      <div className="cover-art" style={style}>
        {!this.props.cover_pic && (
          <div className="cover-text">{this.props.title[0]}</div>
        )}
      </div>
    )
  }

  menu = (
    <Menu onClick={this.handleMenuClick as any}>
      <Menu.Item key={MenuActions.OPEN}>Open</Menu.Item>
      <Menu.Item key={MenuActions.PIN_TO_SIDEBAR}>Pin to Sidebar</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={MenuActions.REMOVE} danger>Remove Subscription</Menu.Item>
    </Menu>
  )

  render() {
    return (
      <Dropdown overlay={this.menu} trigger={['contextMenu']}>
        <div className="sub-item">
          {this.renderCover()}
          <span className="title">{this.props.title}</span>
          <p></p>
          <span className="source">{this.props.source}</span>
        </div>
      </Dropdown>
    )
  } 
}

export default SubscriptionListItem