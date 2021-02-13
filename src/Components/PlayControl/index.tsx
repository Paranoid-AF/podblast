import { BackwardOutlined, CaretRightOutlined, ForwardOutlined, GatewayOutlined, MenuFoldOutlined, PauseOutlined } from '@ant-design/icons'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../common/rematch'
import Item from '../Navi/Panel/Item'
import ScrollingText from './ScrollingText'
import SeekBar from './SeekBar'
import './index.less'


function PlayControl(props: StateProps & DispatchProps) {
  const [isExpanded, setExpanded] = useState(false)
  const handleHover = useCallback((e: React.MouseEvent) => {
    setExpanded(true)
  }, [setExpanded])
  const handleLeave = useCallback((e: React.MouseEvent) => {
    setExpanded(false)
  }, [setExpanded])
  const expandCapsule = useCallback((e: React.MouseEvent) => {
    if(e.button === 0) {
      props.toggleNowPlaying(true)
    }
  }, [props])
  const collapseCapsule = useCallback((e: React.MouseEvent) => {
    props.toggleNowPlaying(false)
  }, [props])
  const renderSpin = useCallback((hidden = false) => {
    let spinClassName = 'control-spin'
    if(isExpanded) {
      spinClassName = 'control-spin expanded'
    }
    if(hidden) {
      spinClassName = 'control-spin hidden'
    }
    return (
      <div className={spinClassName} onMouseEnter={handleHover}>
        <Item id="nowplaying"
          name="正在播放"
          image={props.contentPlaying.cover}
          tooltip={false}
          hoverAnimation={false}
          spinning={true}
          onClick={expandCapsule}
        />
      </div>
    )
  }, [isExpanded, handleHover, props, expandCapsule])
  const handleSeek = useCallback((amount: number) => {
    props.seekTo(amount)
    props.forceSetSeekCurrentTo(amount)
  }, [props])
  const handlePause = useCallback(() => {
    props.pause(!props.isPaused)
  }, [props])

  if(!props.contentPlaying.ready) {
    return null
  }

  let capsuleClassName = 'control-capsule'
  if(isExpanded) {
    capsuleClassName = 'control-capsule expanded'
  }
  if(props.showNowPlaying) {
    capsuleClassName = 'control-capsule open'
  }

  return (
    <div className="control-container" onMouseLeave={handleLeave}>
      { renderSpin(props.showNowPlaying) }
      <div className={capsuleClassName}>
        <div className="capsule-info">
          {
            isExpanded ?
            (
              <ScrollingText width={132} pixelsPerSecond={45} whiteSpaceWidth={15}>
                <span className="info-title">{props.contentPlaying.title}</span>
                <span className="info-channel">{props.contentPlaying.channel}</span>
              </ScrollingText>
            )
            : null
          }
        </div>
        <div className="control-buttons">
          <div className="control-collpase" onClick={collapseCapsule}>
            <button className="collpase"><MenuFoldOutlined /></button>
          </div>
          <button className="ward"><BackwardOutlined /></button>
          <button className="pause" onClick={handlePause}>
            { !props.isPaused ? <PauseOutlined /> : <CaretRightOutlined /> }
          </button>
          <button className="ward"><ForwardOutlined /></button>
          <SeekBar
            episodeTitle={props.contentPlaying.title}
            channel={props.contentPlaying.channel}
            seekCurrent={props.contentPlaying.seekCurrent}
            seekTotal={props.contentPlaying.seekTotal}
            seekLoaded={props.contentPlaying.seekLoaded}
            onChange={handleSeek}
          />
          <button className="pip show-when-open"><GatewayOutlined /></button>
        </div>
      </div>
    </div>
  )
}

export const mapState = (state: RootState) => ({
  showNowPlaying: state.player.showNowPlaying,
  contentPlaying: state.player.playing,
  isPaused: state.player.playing.paused
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleNowPlaying: dispatch.player.toggleNowPlaying,
  pause: dispatch.player.togglePause,
  seekTo: dispatch.player.seekTo,
  forceSetSeekCurrentTo: dispatch.player.setSeekTo
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(PlayControl)