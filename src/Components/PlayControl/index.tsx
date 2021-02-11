import { BackwardOutlined, ForwardOutlined, GatewayOutlined, MenuFoldOutlined, PauseOutlined } from '@ant-design/icons'
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

  if(props.contentPlaying.url === '') {
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
              <ScrollingText width={132} fullScrollTime={5000} whiteSpaceWidth={10}>
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
          <button className="pause"><PauseOutlined /></button>
          <button className="ward"><ForwardOutlined /></button>
          <SeekBar episodeTitle={props.contentPlaying.title} channel={props.contentPlaying.channel} />
          <button className="pip show-when-open"><GatewayOutlined /></button>
        </div>
      </div>
    </div>
  )
}

export const mapState = (state: RootState) => ({
  showNowPlaying: state.player.showNowPlaying,
  contentPlaying: state.player.playing
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleNowPlaying: dispatch.player.toggleNowPlaying
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(PlayControl)