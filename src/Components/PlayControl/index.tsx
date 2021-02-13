import { BackwardOutlined, CaretRightOutlined, ForwardOutlined, GatewayOutlined, MenuFoldOutlined, PauseOutlined } from '@ant-design/icons'
import { FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../common/rematch'
import Item from '../Navi/Panel/Item'
import ScrollingText from './ScrollingText'
import SeekBar from './SeekBar'
import './index.less'
import { Slider } from 'antd'


function PlayControl(props: StateProps & DispatchProps) {
  const [isExpanded, setExpanded] = useState(false)
  const [showVolumeHandle, toggleVolumeHandle] = useState(false)
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
  const handleVolumeMouseUp = useCallback(() => {
    toggleVolumeHandle(false)
    document.removeEventListener('mouseup', handleVolumeMouseUp)
  }, [toggleVolumeHandle])
  const isChangingVolume = useRef(false)
  const handleVolumeMouseHover = useCallback((e: React.MouseEvent) => {
    toggleVolumeHandle(true)
  }, [toggleVolumeHandle])
  const handleVolumeMouseLeave = useCallback((e: React.MouseEvent) => {
    if(!isChangingVolume.current) {
      toggleVolumeHandle(false)
    } else {
      document.addEventListener('mouseup', handleVolumeMouseUp)
    }
  }, [toggleVolumeHandle, handleVolumeMouseUp])
  const handleVolumeMouseDown = useCallback((e: React.MouseEvent) => {
    isChangingVolume.current = true
  }, [])
  const volumeConf: number = props.config['player.volume']
  const [tempVolume, setTempVolume] = useState(-1)
  const handleVolumeChange = useCallback((value: number) => {
    const targetValue = value / 100
    setTempVolume(targetValue)
    props.setVolume(targetValue)
  }, [props])
  const handleVolumeAfterChange = useCallback((value: number) => {
    const targetValue = value / 100
    setTempVolume(-1)
    props.setConfig({
      key: 'player.volume',
      value: targetValue
    })
    props.setVolume(targetValue)
  }, [props])
  const volume = tempVolume >= 0 ? tempVolume : volumeConf
  useEffect(() => {
    props.setVolume(volumeConf)
  }, [])
  const handleMute = useCallback(() => {
    props.toggleMuted(!props.contentPlaying.muted)
  }, [props])
  const handleTogglePIP = useCallback(() => {
    props.togglePIP(!props.showingPIP)
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
          <div className="volume show-when-open"
            onMouseEnter={handleVolumeMouseHover}
            onMouseLeave={handleVolumeMouseLeave}
            onMouseDown={handleVolumeMouseDown}
          >
            <div className="volume-control"
              style={{
                visibility: showVolumeHandle ? 'visible' : 'hidden'
              }}
            >
              <div className="decoration"></div>
              <Slider
                vertical
                value={volume * 100}
                onChange={handleVolumeChange}
                onAfterChange={handleVolumeAfterChange}
              />
            </div>
            <button className="volume-btn" onClick={handleMute}>
              {
                props.contentPlaying.muted ?
                <FaVolumeMute /> :
                <FaVolumeDown />
              }
            </button>
          </div>
          <button
            className="pip show-when-open"
            style={{
              opacity: props.showingPIP ? 1 : 0.5
            }}
            onClick={handleTogglePIP}
          >
            <GatewayOutlined />
          </button>
        </div>
      </div>
    </div>
  )
}

export const mapState = (state: RootState) => ({
  showNowPlaying: state.player.showNowPlaying,
  contentPlaying: state.player.playing,
  isPaused: state.player.playing.paused,
  config: state.app.config.data,
  showingPIP: state.player.playerVisible
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleNowPlaying: dispatch.player.toggleNowPlaying,
  pause: dispatch.player.togglePause,
  seekTo: dispatch.player.seekTo,
  forceSetSeekCurrentTo: dispatch.player.setSeekTo,
  setConfig: dispatch.app.setConfig,
  setVolume: dispatch.player.setVolume,
  toggleMuted: dispatch.player.toggleMuted,
  togglePIP: dispatch.player.togglePIP
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(PlayControl)