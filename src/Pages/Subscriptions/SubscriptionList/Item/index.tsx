import React from 'react'
import './index.less'
import type {
  Subscription,
} from '../../../../../src-electron/data/entity/Subscription'

class SubscriptionListItem extends React.PureComponent<Subscription> {
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

  render() {
    return (
      <div className="sub-item">
        {this.renderCover()}
        <span className="title">{this.props.title}</span>
        <p></p>
        <span className="source">{this.props.source}</span>
      </div>
    )
  } 
}

export default SubscriptionListItem