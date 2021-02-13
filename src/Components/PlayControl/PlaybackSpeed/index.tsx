import { UpOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import React, { useCallback, useState } from 'react'
import './index.less'

const speedAvailable = [0.5, 0.75, 1, 1.25, 1.5, 2, 4, 8]
function PlaybackSpeed(props: Props) {
  const [visible, setVisibility] = useState(false)
  const handleChange = useCallback((e) => {
    props.onChange(parseFloat(e.key))
  }, [props])
  const handleVisibleChange = useCallback((flag: boolean) => {
    setVisibility(flag)
  }, [setVisibility])
  const renderMenu = useCallback(() => (
    <Menu onClick={handleChange} style={{ textAlign: 'center' }}>
      {
        speedAvailable.map(val => {
          const style: React.CSSProperties = {}
          if(val === props.speed) {
            style['background'] = '#4c4646'
            style['color'] = '#fff'
          }
          return (
            <Menu.Item key={val.toString()} style={style}>{val.toString()}x</Menu.Item>
          )
        }).reverse()
      }
    </Menu>
  ), [props, handleChange])
  return (
    <div className="playback-speed show-when-open">
      <Dropdown
        overlay={renderMenu()}
        onVisibleChange={handleVisibleChange}
        visible={visible}
        placement="topCenter"
      >
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          {props.speed.toString()}x <UpOutlined />
        </a>
      </Dropdown>
    </div>
  )
}

interface Props {
  speed: number,
  onChange: (value: number) => void
}

export default PlaybackSpeed