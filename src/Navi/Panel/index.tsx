import React, { Component } from 'react'
import './index.less'

import PanelItem from './Item'

const dragThreshold = 15

class Panel extends Component <Props, State> {
  static defaultProps: Props
  initPos: Position = {
    x: -1,
    y: -1
  }
  sortTargetKey: string | null = null
  state = {
    items: this.props.items,
    sortTargetKey: null,
    sortActive: false
  }
  refSet: Record<string, React.RefObject<HTMLDivElement>> = {}

  static getDerivedStateFromProps(props: Props, state: State) {
    if(!state.sortActive && props.items !== state.items) {
      return {
        items: props.items
      }
    }
    return null
  }

  setItemRef = (key: string, ref: React.RefObject<HTMLDivElement>) => {
    this.refSet[key] = ref
  }

  handleItemMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    if(this.sortTargetKey !== null) {
      return
    }
    this.initPos.x = e.clientX
    this.initPos.y = e.clientY
    document.body.addEventListener('mousemove', this.handleMouseMove)
    document.body.addEventListener('mouseup', this.handleMouseUp)
    this.sortTargetKey = key
  }

  handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    
  }

  handleMouseMove = (e: MouseEvent) => {
    if(!this.state.sortActive && Math.abs(e.clientY - this.initPos.y) > dragThreshold) {
      this.setState({
        sortActive: true
      })
    }
    if(this.state.sortActive) {
      // TODO: handle dragging to sort
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    if(this.state.sortActive) {
      this.setState({
        sortActive: false
      })
    }
    document.body.removeEventListener('mousemove', this.handleMouseMove)
    document.body.removeEventListener('mouseup', this.handleMouseUp)
    this.sortTargetKey = null
  }

  renderDivider() {
    if(this.props.withDivider) {
      return (
        <div className="panel-divider-wrapper">
          <div className="panel-divider"></div>
        </div>
      )
    }
  }


  render() {
    console.log("rerendered!")
    return (
      <div className="panel">
        {this.state.items.map(item => (
          <PanelItem 
            key={item.key}
            id={item.key}
            name={item.name}
            color={item.color}
            image={item.image}
            active={item.key === this.props.current}
            onMouseDown={typeof this.props.onDrag === "function" ? this.handleItemMouseDown : undefined}
            onClick={this.handleItemClick}
            hidden={this.state.sortActive && this.sortTargetKey === item.key}
            tooltip={this.state.sortActive ? false : undefined}
            setRef={this.setItemRef}
          />
        ))}
        { this.renderDivider() }
      </div>
    )
  }
}

type Position = {
  x: number,
  y: number
}

export interface ItemList {
  key: string,
  name: string,
  image?: string,
  color?: string
}

type Props = {
  items: Array<ItemList>,
  current: string,
  withDivider: boolean,
  onDrag?: (newList: Array<ItemList>) => void
}

Panel.defaultProps = {
  items: [],
  current: "",
  withDivider: true
}

type State = {
  items: Array<ItemList>,
  sortActive: boolean
}

export default Panel