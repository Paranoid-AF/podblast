import React from 'react'
import './index.less'

function SeekBar(props: Props) {
  return (
    <div className="control-seekbar show-when-open">
      <div className="info">
        <span className="info-title">{props.episodeTitle}</span>
        <span className="info-channel">{props.channel}</span>
      </div>
      <div className="bar">
        <div className="played"></div>
        <div className="loaded"></div>
        <div className="dot"></div>
      </div>
      <div className="progress">
        <span className="start">00:12</span>
        <span className="end">72:39</span>
      </div>
    </div>
  )
}

interface Props {
  episodeTitle: string,
  channel: string
}

export default SeekBar