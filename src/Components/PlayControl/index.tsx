import { BackwardOutlined, CaretRightOutlined, ForwardOutlined, GatewayOutlined, MenuFoldOutlined, PauseOutlined } from '@ant-design/icons'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../common/rematch'
import Item from '../Navi/Panel/Item'
import ScrollingText from './ScrollingText'
import SeekBar from './SeekBar'
import VolumeHandle from './VolumeHandle'
import PlaybackSpeed from './PlaybackSpeed'
import './index.less'

function PlayControl(props: StateProps & DispatchProps) {
  const [isExpanded, setExpanded] = useState(false)
  const handleHover = useCallback((e: React.MouseEvent) => {
    if(!props.transparent) {
      setExpanded(true)
    }
  }, [props.transparent, setExpanded])
  const handleLeave = useCallback((e: React.MouseEvent) => {
    setExpanded(false)
  }, [setExpanded])
  const expandCapsule = useCallback((e: React.MouseEvent) => {
    if(e.button === 0) {
      props.toggleNowPlaying(true)
    }
    const iframe = document.querySelector('.nowplaying') as HTMLIFrameElement | null
    if(iframe) {
      iframe.style.pointerEvents = 'all'
    }
  }, [props])
  const collapseCapsule = useCallback((e: React.MouseEvent) => {
    props.toggleNowPlaying(false)
    const iframe = document.querySelector('.nowplaying') as HTMLIFrameElement | null
    if(iframe) {
      iframe.style.pointerEvents = 'none'
    }
  }, [props])
  const handleSeek = useCallback((amount: number) => {
    props.seekTo(amount)
  }, [props])
  const handlePause = useCallback(() => {
    props.pause(!props.isPaused)
  }, [props])
  const handleTogglePIP = useCallback(() => {
    props.togglePIP(!props.showingPIP)
  }, [props])
  const handleMuteChange = useCallback((value: boolean) => {
    props.toggleMuted(value)
  }, [props])
  const handleVolumeChange = useCallback((value: number) => {
    props.setVolume(value)
  }, [props])
  const handleVolumeAfterChange = useCallback((value: number) => {
    props.setConfig({
      key: 'player.volume',
      value: value
    })
    props.setVolume(value)
  }, [props])
  const playerSeek = useCallback((amount: number) => {
    const target = props.contentPlaying.seekCurrent + amount
    props.seekTo(target)
  }, [props])
  const handleFastForward = useCallback(() => {
    const targetTime = props.config['player.forwardTime']
    playerSeek(targetTime)
  }, [props, playerSeek])
  const handleFastBackward = useCallback(() => {
    const targetTime = -props.config['player.backwardTime']
    playerSeek(targetTime)
  }, [props, playerSeek])
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
          spinPaused={props.contentPlaying.paused || props.loading}
        />
      </div>
    )
  }, [isExpanded, handleHover, props, expandCapsule])

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
    <div className={props.transparent ? "control-container transparent" : "control-container"} onMouseLeave={handleLeave}>
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
          <button className="ward" onClick={handleFastBackward}><BackwardOutlined /></button>
          <button className="pause" onClick={handlePause}>
            { !props.isPaused ? <PauseOutlined /> : <CaretRightOutlined /> }
          </button>
          <button className="ward" onClick={handleFastForward}><ForwardOutlined /></button>
          <SeekBar
            episodeTitle={props.contentPlaying.title}
            channel={props.contentPlaying.channel}
            seekCurrent={props.contentPlaying.seekCurrent}
            seekTotal={props.contentPlaying.seekTotal}
            seekLoaded={props.contentPlaying.seekLoaded}
            loading={props.contentPlaying.buffering}
            onChange={handleSeek}
          />
          <PlaybackSpeed speed={props.config['player.playbackSpeed']} onChange={props.changePlaybackSpeed}/>
          <VolumeHandle 
            volume={props.config['player.volume']}
            onVolumeChange={handleVolumeChange}
            onVolumeAfterChange={handleVolumeAfterChange}
            muted={props.contentPlaying.muted}
            onMuteChange={handleMuteChange}
          />
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
  showingPIP: state.player.playerVisible,
  loading: state.player.playing.buffering,
  transparent: state.player.spinnerTransparent
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleNowPlaying: dispatch.player.toggleNowPlaying,
  pause: dispatch.player.togglePause,
  seekTo: dispatch.player.seekTo,
  setConfig: dispatch.app.setConfig,
  setVolume: dispatch.player.setVolume,
  toggleMuted: dispatch.player.toggleMuted,
  togglePIP: dispatch.player.togglePIP,
  changePlaybackSpeed: dispatch.player.changePlaybackSpeed
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(PlayControl)