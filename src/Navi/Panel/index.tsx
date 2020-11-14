import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.less'

import PanelItem from './Item'

const dragThreshold = 15

class Panel extends Component <Props, State> {
  static defaultProps: Props
  initPos: Position = {
    x: -1,
    y: -1
  }
  sortTarget: ItemList | null = null
  state = {
    items: this.props.items,
    sortActive: false
  }
  refSet: Record<string, React.RefObject<HTMLDivElement>> = {}
  refDragged: React.RefObject<HTMLDivElement> = React.createRef()
  panelRef: React.RefObject<HTMLDivElement> = React.createRef()
  dragContainer: HTMLDivElement | null = null

  static getDerivedStateFromProps(props: Props, state: State) {
    if(!state.sortActive && props.items !== state.items) {
      return {
        items: props.items
      }
    }
    return null
  }

  componentDidMount() {
    document.addEventListener('mouseleave', this.handleMouseLeave)
  }

  setItemRef = (dragged = false) => {
    if(dragged) {
      return ((key: string, ref: React.RefObject<HTMLDivElement>) => {
        this.refDragged = ref
      })
    } else {
      return ((key: string, ref: React.RefObject<HTMLDivElement>) => {
        this.refSet[key] = ref
      })
    }
  }

  handleItemMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    if(this.sortTarget !== null) {
      return
    }
    /* Find target item to sort. */
    let targetItem: ItemList | null = null
    this.state.items.every((val) => {
      if(val.key === key) {
        targetItem = val
        return false
      }
      return true
    })
    if(targetItem === null) {
      return
    }
    this.sortTarget = targetItem
    /* Set initial position for threshold detection. */
    this.initPos.x = e.clientX
    this.initPos.y = e.clientY
    document.body.addEventListener('mousemove', this.handleMouseMove)
    document.body.addEventListener('mouseup', this.handleMouseUp)
  }

  handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    console.warn(key)
  }

  /* Set drag icon to mouse position. */
  setDragPos = (clientY: number) => {
    console.log(clientY)
    if(this.panelRef.current !== null && this.refDragged.current !== null) {
      const dragHeight = this.refDragged.current.getBoundingClientRect().height
      if(this.dragContainer !== null) {
        this.dragContainer.style.top = `${clientY - dragHeight / 2}px`
      }
    }
  }

  handleMouseMove = (e: MouseEvent) => {
    /* When sort is not active but should be activated. */
    if(!this.state.sortActive && Math.abs(e.clientY - this.initPos.y) > dragThreshold) {
      /* Set sort to active. */
      this.setState({
        sortActive: true
      })
      /* Create drag icon. */
      if(this.dragContainer === null) {
        let container: HTMLDivElement | null = document.body.querySelector('#panel-drag-container')
        if(container === null) {
          container = document.createElement('div')
          container.id = 'panel-drag-container'
          document.body.appendChild(container)
          const wrapper = document.createElement('div')
          wrapper.id = 'panel-drag-wrapper'
          if(this.panelRef.current !== null) {
            wrapper.style.width = `${this.panelRef.current.offsetWidth}px`
          }
          container.appendChild(wrapper)
        }
        this.dragContainer = container
      }
      if(this.sortTarget !== null) {
        ReactDOM.render(this.renderItem(this.sortTarget, true), this.dragContainer.querySelector('#panel-drag-wrapper'))
      }
      /* Adjust position. */
      this.setDragPos(e.clientY)
    }
    if(this.state.sortActive) {
      this.setDragPos(e.clientY)
      let items = this.state.items
      this.setState({ items: items })
      if(typeof this.props.handleSort === "function") {
        this.props.handleSort(items)
      }
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    if(this.state.sortActive) {
      this.setState({
        sortActive: false
      })
      if(typeof this.props.handleSortDone === "function") {
        this.props.handleSortDone()
      }
    }
    document.body.removeEventListener('mousemove', this.handleMouseMove)
    document.body.removeEventListener('mouseup', this.handleMouseUp)
    if(this.dragContainer !== null) {
      this.dragContainer.remove()
      this.dragContainer = null
    }
    this.sortTarget = null
  }

  handleMouseLeave = (e: MouseEvent) => {
    if(this.state.sortActive) {
      this.handleMouseUp(e)
    }
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

  renderItem(item: ItemList, dragged: boolean = false) {
    let shouldHide = this.state.sortActive && !dragged
    if(this.sortTarget !== null) {
      shouldHide = shouldHide && this.sortTarget.key === item.key
    }
     
    return (
      <PanelItem 
        key={item.key}
        id={item.key}
        name={item.name}
        color={item.color}
        image={item.image}
        active={item.key === this.props.current}
        onMouseDown={typeof this.props.handleSort === "function" ? this.handleItemMouseDown : undefined}
        onClick={this.handleItemClick}
        hidden={shouldHide}
        tooltip={(this.state.sortActive || dragged) ? false : undefined}
        dragged={dragged}
        setRef={this.setItemRef(dragged)}
      />
    )
  }

  render() {
    return (
      <div className="panel" ref={this.panelRef}>
        <div className="panel-drag-container"></div>
        {this.state.items.map(item => (
          this.renderItem(item)
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
  handleSort?: (newList: Array<ItemList>) => void,
  handleSortDone?: () => void
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