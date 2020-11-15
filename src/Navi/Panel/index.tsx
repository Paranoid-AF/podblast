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
  sortInitPos: number = -1
  sortCurrentPos: number = -1
  refSet: Record<string, React.RefObject<HTMLDivElement>> = {}
  refDragged: React.RefObject<HTMLDivElement> = React.createRef()
  panelRef: React.RefObject<HTMLDivElement> = React.createRef()
  dragContainer: HTMLDivElement | null = null
  posMap: Array<PosMap> = []

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
    if(this.panelRef.current !== null && this.refDragged.current !== null) {
      const dragHeight = this.refDragged.current.getBoundingClientRect().height
      if(this.dragContainer !== null) {
        this.dragContainer.style.transform = `translateY(${clientY - dragHeight / 2}px)`
      }
    }
  }

  /* Build an array of item center points */
  buildPosMap = () => {
    const resultMap: Array<PosMap> = []
    this.state.items.forEach((val) => {
      if(val.key === this.sortTarget?.key) {
        return
      }
      const targetRef = this.refSet[val.key]
      if(typeof targetRef === "object" && targetRef.current !== null && this.panelRef.current !== null) {
        const itemHtmlRect = targetRef.current.getBoundingClientRect()
        resultMap.push({
          key: val.key,
          y: itemHtmlRect.y + itemHtmlRect.height / 2
        })
      }
    })
    return resultMap
  }

  handleMouseMove = (e: MouseEvent) => {
    /* When sort is not active but should be activated. */
    if(!this.state.sortActive && Math.abs(e.clientY - this.initPos.y) > dragThreshold) {
      /* Set sort to active. */
      this.posMap = this.buildPosMap()
      this.setState({
        sortActive: true
      })
      if(this.sortTarget !== null) {
        this.sortInitPos = this.state.items.indexOf(this.sortTarget)
        this.sortCurrentPos = this.sortInitPos
      }
      /* Create drag icon. */
      if(this.dragContainer === null) {
        let container: HTMLDivElement | null = document.body.querySelector('#panel-drag-container')
        if(container === null) {
          container = document.createElement('div')
          container.id = 'panel-drag-container'
          if(this.panelRef.current !== null) {
            container.style.left = `${this.panelRef.current.getBoundingClientRect().x}px`
          }
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
    /* Drag logic for sorting. */
    if(this.state.sortActive) {
      this.setDragPos(e.clientY)
      let targetKey: string = ""
      if(this.sortTarget !== null) {
        targetKey = this.sortTarget.key
      }
      
      /* Find a position for current sorting target item. */
      const originalPos = this.sortCurrentPos
      this.posMap.some((val, index, arr) => {
        let curPos = originalPos
        if(e.clientY < val.y) {
          curPos = index
          if(this.sortCurrentPos !== curPos) {
            arr.splice(index, 0, {
              key: targetKey,
              y: e.clientY
            })
            this.sortCurrentPos = curPos
          }
          return true
        }
        if(index === arr.length - 1) {
          curPos = index + 1
          if(this.sortCurrentPos !== curPos) {
            arr.push({
              key: targetKey,
              y: e.clientY
            })
            this.sortCurrentPos = curPos
          }
          return true
        }
        return false
      })
      if(originalPos !== this.sortCurrentPos) {
        let items: Array<ItemList> = []
        this.posMap.forEach((val) => {
          const item = this.getItemByKey(val.key)
          if(item !== null) {
            items.push(item)
          }
        })
        this.setState({ items: items })
        if(typeof this.props.handleSort === "function") {
          this.props.handleSort(items)
        }
        this.posMap = this.buildPosMap()
      }
    }
  }

  getItemByKey = (key: string) => {
    let result: ItemList | null = null
    this.state.items.some((val) => {
      if(val.key === key) {
        result = val
        return true
      }
      return false
    })
    return result
  }

  handleMouseUp = (e: MouseEvent) => {
    if(this.state.sortActive) {
      this.setState({
        sortActive: false
      })
      if(typeof this.props.handleSortDone === "function" && this.sortTarget !== null) {
        this.props.handleSortDone({
          key: this.sortTarget.key,
          fromIndex: this.sortInitPos,
          toIndex: this.sortCurrentPos
        })
      }
    }
    document.body.removeEventListener('mousemove', this.handleMouseMove)
    document.body.removeEventListener('mouseup', this.handleMouseUp)
    if(this.dragContainer !== null) {
      this.dragContainer.remove()
      this.dragContainer = null
    }
    this.posMap = []
    this.sortInitPos = -1
    this.sortTarget = null
  }

  handleMouseLeave = (e: MouseEvent) => {
    if(this.state.sortActive) {
      this.handleMouseUp(e)
    }
  }

  handleItemClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    console.log("closed " + key)
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
        onCloseButtonClick={this.handleItemClose}
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

interface PosMap {
  key: string,
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
  handleSortDone?: (result :SortResult) => void
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

export interface SortResult {
  key: string,
  fromIndex: number,
  toIndex: number
}

export default Panel