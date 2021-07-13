import React, { CSSProperties, FC, memo, useCallback, useMemo } from 'react'
import { Rnd } from 'react-rnd'
import { useDispatch } from 'umi'
import {
  setDragDragging,
  setDragHovered,
  setDragSelected,
} from '@/models/drag/actions'
import { useDesigner } from '@/hooks'
import { DragWidgetTypes } from '@/types'

interface DragProps {
  value: DragWidgetTypes
  onValueChange: (id: number, data: any) => any
}

const Drag: FC<DragProps> = memo(({ value, onValueChange }) => {
  const { id, width, height, left, top, background } = useMemo(
    () => ({
      ...value,
      ...value.position,
    }),
    [value],
  )

  const dispatch = useDispatch()

  const { dragging, selected, hovered, shifted } = useDesigner()
  const hasSelected = useMemo(() => {
    return selected === id
  }, [id, selected])

  const hasHovered = useMemo(() => {
    return hovered === id
  }, [hovered, id])

  const hasEditing = useMemo(() => {
    return hasSelected || hasHovered
  }, [hasHovered, hasSelected])

  const moveGrid = useMemo(
    (): [number, number] => [shifted ? 20 : 1, shifted ? 20 : 1],
    [shifted],
  )

  const styles = useMemo(
    (): CSSProperties => ({
      backgroundColor: 'rgba(40,40,66,.7)',
      color: 'rgb(235,235,235)',
      padding: 20,
      borderStyle: 'solid',
      borderColor: hasEditing ? 'rgba(38, 129, 255,.7)' : 'transparent',
      borderWidth: 2,
      cursor: hasEditing ? 'move' : 'pointer',
      transition: 'border-color .2s',
      background,
    }),
    [background, hasEditing],
  )

  // 阻止默认事件、冒泡
  const onStopPropagation = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    return
  }, [])

  const handleSelect = useCallback(
    e => {
      onStopPropagation(e)
      if (dragging) return
      if (e.type === 'mouseenter') setDragHovered(dispatch, id)
      else setDragSelected(dispatch, id)
    },
    [dispatch, dragging, id, onStopPropagation],
  )

  const onDragStartHandle = useCallback(
    e => {
      onStopPropagation(e)
      handleSelect(e)
      setDragSelected(dispatch, id)
    },
    [dispatch, handleSelect, id, onStopPropagation],
  )

  const onDragStopHandle = useCallback(
    (e, d) => {
      onStopPropagation(e)
      onValueChange(id, {
        left: d.lastX,
        top: d.lastY,
      })
      setDragDragging(dispatch, false)
    },
    [onStopPropagation, onValueChange, id, dispatch],
  )

  const onResizeStopHandle = useCallback(
    (e, dir, ref, delta) => {
      onStopPropagation(e)
      onValueChange(value.id, {
        width: delta.width + width,
        height: delta.height + height,
      })
    },
    [height, onStopPropagation, onValueChange, value.id, width],
  )

  const handleCancelSelect = useCallback(
    e => {
      onStopPropagation(e)
      if (dragging) return
      setDragHovered(dispatch, undefined)
    },
    [dispatch, dragging, onStopPropagation],
  )

  return (
    <Rnd
      style={styles}
      bounds="parent"
      resizeGrid={moveGrid}
      dragGrid={moveGrid}
      position={{ x: left, y: top }}
      size={{ width, height }}
      disableDragging={!hasEditing}
      enableResizing={hasEditing}
      onDragStart={onDragStartHandle}
      onDrag={onStopPropagation}
      onDragStop={onDragStopHandle}
      onResizeStart={onStopPropagation}
      onResize={onStopPropagation}
      onResizeStop={onResizeStopHandle}
      onClick={handleSelect}
      onMouseEnter={handleSelect}
      onMouseLeave={handleCancelSelect}
    >
      123
    </Rnd>
  )
})

export default Drag
