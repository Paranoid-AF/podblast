import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../common/rematch'
import './index.less'

function NowPlaying(props: StateProps) {
  return (
    <div className={ props.shouldShow ? "nowplaying open" : "nowplaying" }>
      <iframe
        title="Now Playing Page"
        width="100%"
        height="100%"
        src={props.pageUrl}>
      </iframe>
    </div>
  )
}

const mapState = (state: RootState) => ({
  shouldShow: state.player.showNowPlaying,
  pageUrl: state.player.playing.nowPlayingPage
})

type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(NowPlaying)