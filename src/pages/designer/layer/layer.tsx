import {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd'
import { useDesigner } from '@/hooks'
import { DragWidgetTypes } from '@/types'
import { DropTargetMonitor } from 'react-dnd/dist/types/types'
import { setDragSelected } from '@/models/drag/actions'
import { useDispatch } from 'umi'
import './layer.scss'

type DragObject = {
  id: string
  parent?: string
}

type DropResult = { dragItem: any; overItem: any }

const LayerItem: FC<{
  value: DragWidgetTypes
}> = memo(({ value, children }) => {
  const dispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<'up' | 'middle' | 'down'>()

  const { flatten, selected, separator, onFlattenChange } = useDesigner()

  const dropItem = useCallback(
    ({
      dragId,
      dropId,
      position,
      flatten,
    }: {
      dragId: string
      dropId: string
      position?: 'up' | 'middle' | 'down'
      flatten: any
    }) => {
      if (!position) return []

      let newFlatten = { ...flatten }

      const _dragItem = newFlatten[dragId]

      const dropItem = newFlatten[dropId]
      const parents = dropItem.parent.split(separator)
      let dropParent = newFlatten[parents[parents.length - 1]]
      if (dropId === dragId) {
        return []
      }

      let newId = dragId
      try {
        const newParentId = dropParent?.id || '0'
        newId = newId.replace(_dragItem.parent, newParentId)
      } catch (error) {
        console.error(error)
      }

      // dragParent 的 children 删除 dragId
      try {
        const parents = _dragItem.parent.split(separator)
        const dragParent = newFlatten[parents[parents.length - 1]]
        const idx = dragParent?.children.indexOf(dragId)
        if (idx > -1) {
          dragParent.children.splice(idx, 1)
        }
      } catch (error) {
        console.error(error)
      }
      try {
        // dropParent 的 children 添加 dragId
        const newChildren = dropParent?.children || [] // 要考虑children为空，inside的情况
        const idx = newChildren.indexOf(dropId)
        // TODO: 优化逻辑
        switch (position) {
          case 'up':
            newChildren.splice(idx, 0, dragId)
            _dragItem.parent = dropItem.parent
            _dragItem.widget.position = {
              ..._dragItem.widget.position,
              left: _dragItem.totalX - dropParent.totalX,
              top: _dragItem.totalY - dropParent.totalY,
            }
            break
          case 'down':
            newChildren.splice(idx + 1, 0, dragId)
            _dragItem.parent = dropItem.parent
            _dragItem.widget.position = {
              ..._dragItem.widget.position,
              left: _dragItem.totalX - dropParent.totalX,
              top: _dragItem.totalY - dropParent.totalY,
            }
            break
          case 'middle':
            if (!dropItem.children) {
              dropItem.children = []
            }
            _dragItem.parent = dropItem.parent + separator + dropId
            dropItem.children.unshift(dragId)
            _dragItem.widget.position = {
              ..._dragItem.widget.position,
              left: _dragItem.totalX - dropItem.totalX,
              top: _dragItem.totalY - dropItem.totalY,
            }
            _dragItem.children?.forEach((id: string) => {
              const item = newFlatten[id]
              item.parent =
                dropItem.parent + separator + dropId + separator + dragId
            })
            break
        }

        dropParent.children = newChildren
      } catch (error) {
        console.error(error)
      }

      return [newFlatten, newId]
    },
    [separator],
  )

  const { id } = value,
    item = useMemo(
      () => ({
        id: String(id),
      }),
      [id],
    )

  const [{ isDragging }, dragRef] = useDrag<DragObject, DropResult, any>(
    {
      type: 'item',
      item,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [item],
  )

  const drop: (
    item: DragObject,
    monitor: DropTargetMonitor,
  ) => void = useCallback(
    (item: DragObject, monitor) => {
      // 如果 children 已经作为了 drop target，不处理
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      const [newFlatten, newId] = dropItem({
        dragId: item.id, // 内部拖拽用dragId
        dropId: String(id),
        position,
        flatten,
      })
      newFlatten && onFlattenChange(newFlatten)
      newId && setDragSelected(dispatch, newId)
    },
    [dispatch, dropItem, flatten, id, onFlattenChange, position],
  )

  const hover: (
    item: DragObject,
    monitor: DropTargetMonitor,
  ) => void = useCallback(
    (item: DragObject, monitor) => {
      const dragId = item.id

      // 拖拽元素下标与鼠标悬浮元素下标一致或拖拽元素包含鼠标悬浮元素时，不进行操作
      if (
        dragId === id ||
        flatten?.[id].parent.split(separator).includes(dragId)
      ) {
        setPosition(undefined)
        return
      }

      const didHover = monitor.isOver({ shallow: true })
      if (didHover) {
        const hoverBoundingRect =
          ref.current && ref.current.getBoundingClientRect()

        const hoverHeight = hoverBoundingRect?.height || 0
        const dragOffset = monitor.getClientOffset()
        const hoverClientY =
          (dragOffset?.y || 0) - (hoverBoundingRect?.top || 0)

        const topBoundary = hoverHeight / 3,
          bottomBoundary = hoverHeight / 1.5

        if (hoverClientY < topBoundary) {
          setPosition('up')
        } else if (hoverClientY <= bottomBoundary) {
          setPosition('middle')
        } else {
          setPosition('down')
        }
      }
    },
    [id],
  )

  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: 'item',
      drop,
      hover,
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [drop, hover],
  )

  dragRef(dropRef(ref))

  const isActive = canDrop && isOver

  let overwriteStyle: CSSProperties = useMemo(() => {
    let style: CSSProperties = {
      padding: 20,
      backgroundColor: selected === id ? '#2681ff' : '#22242b',
      opacity: isDragging ? 0.4 : 1,
      cursor: 'grab',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderBottomColor: '#2a2c33',
      borderTopColor: '#2a2c33',
      borderLeftColor: '#2a2c33',
      borderRightColor: '#2a2c33',
      transition: 'all .1s',
    }
    if (isActive) {
      if (position === 'up') {
        style = {
          ...style,
          borderTopColor: '#2681ff',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        }
      } else if (position === 'down') {
        style = {
          ...style,
          borderBottomColor: '#2681ff',
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        }
      } else if (position === 'middle') {
        style = {
          ...style,
          borderBottomColor: '#2681ff',
          borderTopColor: '#2681ff',
          borderLeftColor: '#2681ff',
          borderRightColor: '#2681ff',
        }
      }
    }

    return style
  }, [id, isActive, isDragging, position, selected])

  const handleClick = useCallback(
    e => {
      e.stopPropagation()
      setDragSelected(dispatch, id)
    },
    [dispatch, id],
  )

  return (
    <div
      ref={ref}
      style={overwriteStyle}
      onClick={handleClick}
      className="layer-item"
    >
      {value.id}
      <br />
      <div>{children}</div>
    </div>
  )
})

const Layer = memo(() => {
  const { widgets } = useDesigner()

  const createLayer = useCallback(() => {
    const rec = (list: DragWidgetTypes[], parentId: string | number | null) => {
      const d: any[] = []
      for (const k in list) {
        if (Object.prototype.hasOwnProperty.call(list, k)) {
          const item = list[k]
          d[k] = (
            <LayerItem key={item.id} value={item}>
              {item.children && rec(item.children, item.id)}
            </LayerItem>
          )
        }
      }

      return d
    }

    return rec(widgets!, null)
  }, [widgets])

  return <DndProvider backend={HTML5Backend}>{createLayer()}</DndProvider>
})

export default Layer
