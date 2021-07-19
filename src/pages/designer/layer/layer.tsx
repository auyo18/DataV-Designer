import {
  CSSProperties,
  FC,
  Fragment,
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
import { setDragSelectedMultiple, setDragSelected } from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { Button, Collapse, Space, Badge } from 'antd'
import {
  GroupOutlined,
  RightOutlined,
  DownOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import './layer.scss'
import { flattenTopName } from '@/constants'

type DragObject = {
  uniqueId: string
  parent?: string
}

type DropResult = { dragItem: any; overItem: any }

const groupName = 'group',
  { Panel } = Collapse,
  dropItem = ({
    dragId,
    dropId,
    position,
    flatten,
    separator,
  }: {
    dragId: string
    dropId: string
    position?: 'up' | 'middle' | 'down'
    flatten: any
    separator: string
  }) => {
    if (!position) return []

    let newFlatten = { ...flatten }

    const _dragItem = newFlatten[dragId]

    const dropItem = newFlatten[dropId]
    const parents = dropItem.parent?.split(separator)
    let dropParent =
      newFlatten[parents ? parents[parents.length - 1] : flattenTopName]
    if (dropId === dragId) {
      return []
    }

    let newId = dragId
    try {
      const newParentId = dropParent?.uniqueId || flattenTopName
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
          break
        case 'down':
          newChildren.splice(idx + 1, 0, dragId)
          _dragItem.parent = dropItem.parent
          break
        case 'middle':
          if (!dropItem.children) {
            dropItem.children = []
          }
          _dragItem.parent = dropItem.parent
            ? dropItem.parent + separator + dropId
            : dropId
          dropItem.children.unshift(dragId)
          _dragItem.children?.forEach((id: string) => {
            const item = newFlatten[id]
            item.parent = _dragItem.parent + separator + dragId
          })
          break
      }

      dropParent.children = newChildren
    } catch (error) {
      console.error(error)
    }

    return [newFlatten, newId]
  }

const LayerItem: FC<{
  value: DragWidgetTypes
  level: number
}> = memo(({ value, level, children }) => {
  const dispatch = useDispatch()

  const [activeKey, setActiveKey] = useState<string[]>()

  const onCollapseChange = useCallback(e => {
    e.stopPropagation()
    setActiveKey(key => {
      return key?.length ? [] : ['1']
    })
  }, [])

  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<'up' | 'middle' | 'down'>()

  const {
    flatten,
    selected,
    controlled,
    separator,
    onFlattenChange,
  } = useDesigner()

  const { uniqueId, type } = value,
    item = useMemo(
      () => ({
        uniqueId,
      }),
      [uniqueId],
    )

  const [{ isDragging }, dragRef] = useDrag<DragObject, DropResult, any>(
    {
      type: 'layer',
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
        dragId: item.uniqueId, // 内部拖拽用dragId
        dropId: uniqueId,
        position,
        flatten,
        separator,
      })
      newFlatten && onFlattenChange(newFlatten)
      newId && setDragSelected(dispatch, [newId])
    },
    [dispatch, flatten, onFlattenChange, position, separator, uniqueId],
  )

  const hover: (
    item: DragObject,
    monitor: DropTargetMonitor,
  ) => void = useCallback(
    (item: DragObject, monitor) => {
      const dragId = item.uniqueId

      // 拖拽元素下标与鼠标悬浮元素下标一致或拖拽元素包含鼠标悬浮元素时，不进行操作
      if (
        dragId === uniqueId ||
        flatten?.[uniqueId].parent.split(separator).includes(dragId)
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

        const topBoundary = Math.min(hoverHeight / 3, 60),
          bottomBoundary = Math.max(hoverHeight / 1.5, hoverHeight - 60)

        // let position: any
        if (hoverClientY < topBoundary) {
          // position = 'up'
          setPosition('up')
        } else if (hoverClientY <= bottomBoundary && type === groupName) {
          // position = 'middle'
          setPosition('middle')
        } else if (hoverClientY > bottomBoundary) {
          // position = 'down'
          setPosition('down')
        }
      }
    },
    [uniqueId, flatten, separator, type],
  )

  const [{ canDrop, isOver }, dropRef] = useDrop(
    () => ({
      accept: 'layer',
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
      fontSize: 14,
      width: '100%',
      padding: `12px 16px 12px ${level > 1 ? level * 16 + 8 : 16}px`,
      backgroundColor: selected?.includes(uniqueId) ? '#d0e2ff' : 'transparent',
      opacity: isDragging ? 0.4 : 1,
      cursor: 'grab',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      transition: 'all .1s',
    }
    if (isActive) {
      if (position === 'up') {
        style = {
          ...style,
          borderTopColor: '#FF6666',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        }
      } else if (position === 'down') {
        style = {
          ...style,
          borderBottomColor: '#FF6666',
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        }
      } else if (position === 'middle') {
        style = {
          ...style,
          borderBottomColor: '#FF6666',
          borderTopColor: '#FF6666',
          borderLeftColor: '#FF6666',
          borderRightColor: '#FF6666',
        }
      }
    }

    return style
  }, [level, selected, uniqueId, isDragging, isActive, position])

  const handleClick = useCallback(
    e => {
      e.stopPropagation()
      if (controlled) setDragSelectedMultiple(dispatch, uniqueId)
      else setDragSelected(dispatch, [uniqueId])
    },
    [controlled, dispatch, uniqueId],
  )

  return (
    <div ref={ref} onClick={handleClick} className="layer-item">
      {type === 'group' ? (
        <>
          <Space style={{ ...overwriteStyle }} align="center">
            <Button
              size="small"
              type="text"
              icon={activeKey?.length ? <DownOutlined /> : <RightOutlined />}
              onClick={onCollapseChange}
            />
            <Badge
              size="small"
              offset={[16, 0]}
              count={(children as any[])?.length}
            >
              <Space>
                <GroupOutlined />
                {value.name}
              </Space>
            </Badge>
          </Space>
          {children && (
            <Collapse ghost activeKey={activeKey}>
              <Panel showArrow={false} header={null} key="1">
                {children}
              </Panel>
            </Collapse>
          )}
        </>
      ) : (
        <Space style={overwriteStyle}>
          <PictureOutlined />
          {value.name}
        </Space>
      )}
    </div>
  )
})

const Layer = memo(() => {
  const dispatch = useDispatch()
  const {
    widgets,
    handleAddWidget,
    separator,
    onFlattenChange,
    selected,
  } = useDesigner()

  const createLayer = useCallback(() => {
    const rec = (list: DragWidgetTypes[], level: number) => {
      const d: any[] = []
      for (const k in list) {
        if (Object.prototype.hasOwnProperty.call(list, k)) {
          const item = list[k]
          d[k] = (
            <LayerItem key={item.uniqueId} value={item} level={level}>
              {item.children && rec(item.children, level + 1)}
            </LayerItem>
          )
        }
      }

      return d
    }

    return rec(widgets!, 1)
  }, [widgets])

  const handleAddGroup = useCallback(
    e => {
      e.stopPropagation()
      let { newWidget, newFlatten } = handleAddWidget({
        name: '分组',
        type: groupName,
        position: {
          width: 0,
          height: 0,
          left: 100,
          top: 50,
        },
      })

      let level = 0,
        parent: string
      let flatten = selected?.reverse()?.reduce((flatten, id) => {
        const parents = flatten[id].parent.split(separator)
        if (level < parents.length) {
          level = parents.length
          parent = parents[parents.length - 1]
        }

        const [newFlatten] = dropItem({
          dragId: id,
          dropId: newWidget?.uniqueId,
          position: 'middle',
          flatten,
          separator,
        })

        return newFlatten
      }, newFlatten)

      ;[newFlatten] = dropItem({
        dragId: newWidget?.uniqueId,
        dropId: parent!,
        position: 'middle',
        flatten,
        separator,
      })

      newFlatten && onFlattenChange(newFlatten)
      setDragSelected(dispatch, [newWidget.uniqueId])
    },
    [dispatch, handleAddWidget, onFlattenChange, selected, separator],
  )

  return (
    <Fragment>
      <div
        style={{
          textAlign: 'center',
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 3,
        }}
      >
        图层
      </div>
      <Space
        style={{
          textAlign: 'center',
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 3,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Button
          size="small"
          type="text"
          icon={<GroupOutlined />}
          onClick={handleAddGroup}
        />
        <Button
          size="small"
          type="text"
          icon={<GroupOutlined />}
          onClick={handleAddGroup}
        />
        <Button
          size="small"
          type="text"
          icon={<GroupOutlined />}
          onClick={handleAddGroup}
        />
      </Space>
      <div className="container" style={{ backgroundColor: 'white' }}>
        <DndProvider backend={HTML5Backend}>{createLayer()}</DndProvider>
      </div>
    </Fragment>
  )
})

export default Layer
