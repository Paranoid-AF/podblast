import React, { Component } from 'react'
import './index.less'

import Panel, { ItemList } from './Panel'

const bruh = [
  {
    key: "uuid1",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid2",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  }
]

class Navi extends Component <Props, State> {
  state = {
    borderless: false,
    itemList: bruh,
    currentItemKey: ""
  }

  componentDidMount() {
    this.setState({
      itemList: bruh,
      currentItemKey: "uuid1"
    })
  }

  onPanelSort = (newList: Array<ItemList>)=> {
    this.setState({
      itemList: newList
    })
  }

  render() {
    return (
      <div className={ this.state.borderless ? "navi navi-borderless" : "navi" }>
        <Panel items={this.state.itemList} current={this.state.currentItemKey} onDrag={this.onPanelSort} />
      </div>
    )
  }
}

type Props = { }

type State = {
  borderless: boolean,
  itemList: Array<ItemList>,
  currentItemKey: string
}


export default Navi