import React from 'react'
import './index.less'
import type {
  Subscription,
} from '../../../../../src-electron/data/entity/Subscription'
import { Menu, Dropdown } from 'antd';

export enum MenuActions {
  OPEN = 'OPEN',
  PIN_TO_SIDEBAR = 'PIN_TO_SIDEBAR',
  REMOVE = 'REMOVE'
}

class SubscriptionListItem extends React.PureComponent<Subscription & Props> {
  handleMenuClick = (event: { key: MenuActions }) => {
    if(this.props.onContextMenu) {
      this.props.onContextMenu(this.props, event.key)
    }
  }

  handleClick = () => {
    if(this.props.onClick) {
      this.props.onClick(this.props)
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
      <div className="cover-art" style={style} onClick={this.handleClick}>
        {!this.props.cover_pic && (
          <div className="cover-text">{this.props.title[0]}</div>
        )}
      </div>
    )
  }

  renderMenu = () => (
    <Menu onClick={this.handleMenuClick as any}>
      <Menu.Item key={MenuActions.OPEN}>Open</Menu.Item>
      <Menu.Item key={MenuActions.PIN_TO_SIDEBAR}>{ this.props.pinned ? "Unpin from Sidebar" : "Pin to Sidebar" }</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={MenuActions.REMOVE} danger>Remove Subscription</Menu.Item>
    </Menu>
  )

  render() {
    return (
      <Dropdown overlay={this.renderMenu()} trigger={['contextMenu']}>
        <div className="sub-item">
          {this.renderCover()}
          <span className="title" onClick={this.handleClick}>{this.props.title}</span>
          <p></p>
          <span className="source" onClick={this.handleClick}>{this.props.source}</span>
        </div>
      </Dropdown>
    )
  } 
}

interface Props {
  onClick?: (iten: Subscription) => void,
  onContextMenu?: (item: Subscription, action: MenuActions) => void
}

export default SubscriptionListItem