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

function getStyle(backgroundColor: string): CSSProperties {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '8rem',
    minWidth: '8rem',
    color: 'white',
    backgroundColor,
    padding: '2rem',
    paddingTop: '1rem',
    margin: '1rem',
    textAlign: 'center',
    float: 'left',
    fontSize: '1rem',
  }
}

const LayerItem: FC<{
  value: DragWidgetTypes
  index: number
}> = memo(({ value, index, children }) => {
  const ref = useRef(null)
  const [hasDropped, setHasDropped] = useState(false)
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false)

  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // item 中包含 index 属性，则在 drop 组件 hover 和 drop 是可以根据第一个参数获取到 index 值
    type: 'box',
  })

  const [{ isOver, isOverCurrent }, dropRef] = useDrop(
    () => ({
      accept: 'box',
      drop(item, monitor) {
        const didDrop = monitor.didDrop()
        setHasDropped(true)
        setHasDroppedOnChild(didDrop)
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [setHasDropped, setHasDroppedOnChild],
  )
  let backgroundColor = 'rgba(0, 0, 0, .5)'
  if (isOverCurrent || isOver) {
    backgroundColor = 'darkgreen'
  }

  dragRef(dropRef(ref))

  return (
    <div ref={ref} style={getStyle(backgroundColor)}>
      {value.id}
      <br />
      {hasDropped && <span>dropped {hasDroppedOnChild && ' on child'}</span>}

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
    const rec = (list?: DragWidgetTypes[]) => {
      if (!list) return
      const d: any[] = []
      for (const k in list) {
        if (Object.prototype.hasOwnProperty.call(list, k)) {
          const item = list[k]
          d[k] = (
            <LayerItem key={item?.id} index={Number(k)} value={item}>
              {rec(item?.children)}
            </LayerItem>
          )
        }
      }

      return d
    }

    return rec(list)
  }, [list])

  return <DndProvider backend={HTML5Backend}>{createLayer()}</DndProvider>
})

export default Layer
