import React, { Component } from 'react'
import { RouteChildrenProps, RouterProps, withRouter } from 'react-router-dom'
import './index.less'
import Panel, { ItemList, SortResult } from './Panel'

const bruh = [
  {
    key: "channel/uuid1",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid2",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid3",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid4",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid5",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid6",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid7",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid8",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid9",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid10",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid11",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  }
]

const routes = [
  {
    key: "home",
    name: "首页",
    link: "/"
  },
  {
    key: "extensions",
    name: "扩展程序",
    link: "/extensions"
  }
]

class Navi extends Component<Props> {
  state = {
    borderless: false,
    itemList: bruh
  }
  nextList: Array<ItemList> | null = null

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
    // console.log('clicked ' + key, e)
    routes.forEach(val => {
      if(val.key === key) {
        this.props.router.history.push(val.link)
      }
    })
  }

  render() {
    let currentItemKey = 'home'
    routes.forEach(val => {
      if(val.link === this.props.router.location.pathname) {
        currentItemKey = val.key
      }
    })

    return (
      <div className="navi">
        <Panel
          items={routes}
          current={currentItemKey}
          onClick={this.handleClick}
        />
        <Panel
          items={this.state.itemList}
          current={currentItemKey}
          onSort={this.handlePanelSort}
          onSortDone={this.handleSortDone}
          onClick={this.handleClick}
          withDivider={false}
        />
      </div>
    )
  }
}

interface Props {
  router: RouteChildrenProps
}

const mapRouter = (props: any) => {
  return (
    <Navi router={props} />
  )
}


export default withRouter(mapRouter)