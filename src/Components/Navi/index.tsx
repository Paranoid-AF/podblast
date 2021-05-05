import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './index.less'
import { RootState, Dispatch } from'../../common/rematch'
import Panel, { ItemList, SortResult } from './Panel'
import { connect } from 'react-redux'
import { generateURL, parseURL } from '../../common/utils/detail-url'
import { routes } from '../../Routes/navi'

function mapProps(props: StateProps['tabs']['pinned'] | StateProps['tabs']['regular']) {
  return props.map(item => ({
    key: item.uuid,
    name: item.title,
    color: item.cover_color || '#888',
    image: item.cover_pic || undefined
  } as ItemList))
}

class Navi extends React.PureComponent<StateProps & DispatchProps & RouteComponentProps> {
  state = {
    borderless: false,
    regularTabs: [] as Array<ItemList>,
    pinnedTabs: [] as Array<ItemList>
  }
  nextListRegular: Array<ItemList> | null = null

  static getDerivedStateFromProps(props: StateProps) {
    return {
      regularTabs: mapProps(props.tabs.regular),
      pinnedTabs: mapProps(props.tabs.pinned)
    }
  }

  componentDidMount() {
    this.props.initPinnedTabs()
  }

  handleRegularTabsPanelSort = (newList: Array<ItemList>) => {
    this.nextListRegular = newList
  }

  handleRegularTabsSortStart = () => {
    if(this.props.toggleCoverTransparency) {
      this.props.toggleCoverTransparency(true)
    }
  }

  handleRegularTabsSortDone = (result: SortResult) => {
    if(this.props.toggleCoverTransparency) {
      this.props.toggleCoverTransparency(false)
    }
    if(this.nextListRegular !== null) {
      this.props.swapTabs({
        type: 'regular',
        uuidFrom: this.state.regularTabs[result.fromIndex]['key'],
        uuidTo: this.state.regularTabs[result.toIndex]['key']
      })
    }
  }

  handleRoutesClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
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
    if(currentItemKey === '') {
      const { pinnedTabs } = this.state
      for(let i=0; i<pinnedTabs.length; i++) {
        const urlInfo = parseURL(this.props.location)
        if(urlInfo && urlInfo.id === pinnedTabs[i].key) {
          currentItemKey = pinnedTabs[i].key
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
          items={this.state.pinnedTabs}
          current={currentItemKey}
          onClick={this.handleTabClick}
          withDivider={this.state.pinnedTabs.length > 0}
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
  swapTabs: dispatch.app.swapTabs,
  initPinnedTabs: dispatch.subscription.initPinnedTabs
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(withRouter(Navi))