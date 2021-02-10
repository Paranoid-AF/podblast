import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from'../../common/rematch'
import Item from '../Navi/Panel/Item'
import './index.less'

function PlayControl(props: StateProps & DispatchProps) {
  const [isExpanded, setExpanded] = useState(false)
  const handleHover = useCallback((e: React.MouseEvent) => {
    setExpanded(true)
  }, [setExpanded])
  const handleLeave = useCallback((e: React.MouseEvent) => {
    setExpanded(false)
  }, [setExpanded])
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
          onClick={() => {props.toggleNowPlaying(true)}}
        />
      </div>
    )
  }, [isExpanded, handleHover, props])
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
        <div className="control-buttons">
          <button style={{color: '#000'}} onClick={() => {props.toggleNowPlaying(false)}}>Take me back!</button>
        </div>
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  showNowPlaying: state.player.showNowPlaying,
  contentPlaying: state.player.playing
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleNowPlaying: dispatch.player.toggleNowPlaying
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(PlayControl)