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
import {
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
  XYCoord,
} from 'react-dnd'
import { useDesigner } from '@/hooks'
import { DragWidgetTypes } from '@/types'

type DragObject = {
  id: number
  parentId: number | null
  children?: DragWidgetTypes[]
}

type DropResult = { dragItem: any; overItem: any }

const LayerItem: FC<{
  value: DragWidgetTypes
  parentId: number | null
}> = memo(({ value, parentId, children }) => {
  const ref = useRef<HTMLDivElement>(null)

  const { id } = value

  const [{ isDragging }, dragRef, dragPreview] = useDrag<
    DragObject,
    DropResult,
    any
  >({
    type: 'item',
    item: {
      id,
      parentId,
      children: value.children,
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop(
    () => ({
      accept: 'item',
      hover(item: DragObject, monitor) {
        if (!ref.current) {
          return
        }

        const {
          id: draggedId,
          parentId: dragParentId,
        } = monitor.getItem() as DragObject

        const { parentId: overParentId } = item
        const hoverId = id

        const didDrop = monitor.didDrop()

        if (didDrop) {
          return undefined
        }

        if (draggedId) {
          if (
            draggedId === hoverId ||
            draggedId === overParentId ||
            dragParentId === hoverId
          )
            return undefined

          console.log(draggedId, dragParentId, hoverId, overParentId)

          return {
            dragItem: { draggedId, dragParentId },
            overItem: { overId: hoverId, overParentId },
          }
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  )

  dragRef(dropRef(ref))

  return (
    <div
      ref={ref}
      style={{ padding: 20, backgroundColor: '#3a3d48', margin: 4 }}
    >
      {value.id}
      <br />

      <div>{children}</div>
    </div>
  )
})

const Layer = memo(() => {
  const { widgets } = useDesigner()
  const [list, setList] = useState<any[]>([
    { id: 1, type: '1111111' },
    { id: 2, type: '2222222222' },
  ])

  const createLayer = useCallback(() => {
    const rec = (list: DragWidgetTypes[], parentId: number | null) => {
      const d: any[] = []
      for (const k in list) {
        if (Object.prototype.hasOwnProperty.call(list, k)) {
          const item = list[k]
          d[k] = (
            <LayerItem key={item.id} parentId={parentId} value={item}>
              {item.children && rec(item.children, item.id)}
            </LayerItem>
          )
        }
      }

      return d
    }

    return rec(list, null)
  }, [list])

  return <DndProvider backend={HTML5Backend}>{createLayer()}</DndProvider>
})

export default Layer
