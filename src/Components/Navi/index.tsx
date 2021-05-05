import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './index.less'
import { RootState, Dispatch } from'../../common/rematch'
import Panel, { ItemList, SortResult } from './Panel'
import { connect } from 'react-redux'
import { generateURL, parseURL } from '../../common/utils/detail-url'

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
  },
  {
    key: "channel/uuid12",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
  {
    key: "channel/uuid13",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
  {
    key: "channel/uuid14",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
  {
    key: "channel/uuid15",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
  {
    key: "channel/uuid16",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
  {
    key: "channel/uuid17",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  },
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
  },
  {
    key: "sub",
    name: "订阅",
    link: "/subscriptions"
  }
]

class Navi extends React.PureComponent<StateProps & DispatchProps & RouteComponentProps> {
  state = {
    borderless: false,
    regularTabs: [] as Array<ItemList>
  }
  nextList: Array<ItemList> | null = null

  static getDerivedStateFromProps(props: StateProps) {
    return {
      regularTabs: props.tabs.regular.map(item => ({
        key: item.uuid,
        name: item.title,
        color: item.cover_color || '#888',
        image: item.cover_pic || undefined
      } as ItemList))
    }
  }

  handleRegularTabsPanelSort = (newList: Array<ItemList>) => {
    this.nextList = newList
  }

  handleRegularTabsSortStart = () => {
    if(this.props.toggleCoverTransparency) {
      this.props.toggleCoverTransparency(true)
    }
  }

  handleRegularTabsSortDone = (result: SortResult) => {
    console.log(result)
    if(this.props.toggleCoverTransparency) {
      this.props.toggleCoverTransparency(false)
    }
    if(this.nextList !== null) {
      this.props.swapTabs({
        type: 'regular',
        uuidFrom: this.state.regularTabs[result.fromIndex]['key'],
        uuidTo: this.state.regularTabs[result.toIndex]['key']
      })
    }
  }

  handleRoutesClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    // console.log('clicked ' + key, e)
    for(let i=0; i<routes.length; i++) {
      if(routes[i].key === key) {
        this.props.history.push(routes[i].link)
        break
      }
    }
  }

  handleTabClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    const targetURL = generateURL({ id: key })
    this.props.history.push(targetURL)
  }

  renderControl = () => {
    if(this.props.contentPlaying.ready) {
      return (
        <div className="control-navi-container">
          <div className="control-gradient"></div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    let currentItemKey = ''
    for(let i=0; i<routes.length; i++) {
      if(routes[i].link === this.props.location.pathname) {
        currentItemKey = routes[i].key
        break
      }
    }
    if(currentItemKey === '') {
      const { regularTabs } = this.state
      for(let i=0; i<regularTabs.length; i++) {
        const urlInfo = parseURL(this.props.location)
        if(urlInfo && urlInfo.id === regularTabs[i].key) {
          currentItemKey = regularTabs[i].key
          break
        }
      }
    }
    return (
      <div className={this.props.contentPlaying.ready ? "navi play" : "navi"}>
        <Panel
          items={routes}
          current={currentItemKey}
          onClick={this.handleRoutesClick}
        />
        <Panel
          items={this.state.regularTabs}
          current={currentItemKey}
          onSort={this.handleRegularTabsPanelSort}
          onSortStart={this.handleRegularTabsSortStart}
          onSortDone={this.handleRegularTabsSortDone}
          onClick={this.handleTabClick}
          withDivider={false}
        />
        {this.renderControl()}
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  contentPlaying: state.player.playing,
  tabs: state.app.tabs
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleCoverTransparency: dispatch.player.toggleCoverTransparency,
  swapTabs: dispatch.app.swapTabs
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(withRouter(Navi))