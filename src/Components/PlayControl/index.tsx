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
  const renderSpin = useCallback(() => {
    return (
      <div className={isExpanded ? "control-spin expanded" : "control-spin"} onMouseEnter={handleHover}>
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
  }, [isExpanded, handleHover, props.contentPlaying.cover])
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
      { !props.showNowPlaying ? renderSpin() : null }
      <div className={capsuleClassName}>
        <div className="control-buttons">
          
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