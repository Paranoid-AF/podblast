import React, { Component } from 'react'
import './index.less'
import Panel, { ItemList, SortResult } from './Panel'

const bruh = [
  {
    key: "uuid1",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid2",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid3",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid4",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid5",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid6",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "uuid7",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "uuid8",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "uuid9",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "uuid10",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "uuid11",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  }
]

class Navi extends Component {
  state = {
    borderless: false,
    itemList: bruh,
    currentItemKey: ""
  }
  nextList: Array<ItemList> | null = null
  componentDidMount() {
    this.setState({
      itemList: bruh,
      currentItemKey: "uuid1"
    })
  }

  handlePanelSort = (newList: Array<ItemList>) => {
    this.nextList = newList
  }

  handleSortDone = (result: SortResult) => {
    if(this.nextList !== null) {
      this.setState({
        itemList: this.nextList
      })
    }
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    // console.log('clicked ' + key)
  }

  render() {
    return (
      <div className="navi">
        <Panel
         items={this.state.itemList}
         current={this.state.currentItemKey}
         onSort={this.handlePanelSort}
         onSortDone={this.handleSortDone}
         onClick={this.handleClick}
        />
      </div>
    )
  }
}




export default Navi