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
  onValueChange: (id: number | string, data: any) => any
  scale: number
}

const timeDiff = 250

const Drag: FC<DragProps> = memo(
  ({ value, onValueChange, scale, children }) => {
    const { id, width, height, left, top, color, background } = useMemo(
      () => ({
        ...value,
        ...value.position,
      }),
      [value],
    )

    const dispatch = useDispatch()
    const { pageInfo, dragging, selected, hovered, shifted, clickTime } =
      useDesigner()
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
        color: color || 'white',
        padding: 20,
        borderStyle: 'solid',
        borderColor: hasEditing ? 'rgba(38, 129, 255,.7)' : 'transparent',
        borderWidth: 2,
        cursor: hasEditing ? 'move' : 'pointer',
        transition: 'border-color .2s',
        background: background || '#282842b3',
      }),
      [background, color, hasEditing],
    )

    // 阻止默认事件、冒泡
    const onStopPropagation = useCallback(e => {
      e.preventDefault()
      e.stopPropagation()
      return
    }, [])

    // TODO：BUG，双击后松开鼠标选中项变成顶级元素
    const handleSelect = useCallback(
      e => {
        if (!id) return
        const isMouseenter = e.type === 'mouseenter'
        if (Date.now() - clickTime <= timeDiff) {
          onStopPropagation(e)
        }
        if (dragging) return
        if (isMouseenter) setDragHovered(dispatch, id)
        else setDragSelected(dispatch, id)
      },
      [clickTime, dispatch, dragging, id, onStopPropagation],
    )

    const onDragStartHandle = useCallback(
      e => {
        if (!id) return
        onStopPropagation(e)
        handleSelect(e)
        setDragSelected(dispatch, id)
        setDragDragging(dispatch, true)
      },
      [dispatch, handleSelect, id, onStopPropagation],
    )

    const onDragStopHandle = useCallback(
      (e, d) => {
        if (!id) return
        onStopPropagation(e)
        onValueChange(id, {
          left: Math.round(d.x),
          top: Math.round(d.y),
        })
        setDragDragging(dispatch, false)
      },
      [onStopPropagation, onValueChange, id, dispatch],
    )

    const onResizeStopHandle = useCallback(
      (e, dir, ref, delta) => {
        if (!id) return
        onStopPropagation(e)
        let w, h
        if (String(width).includes('%')) {
          w = `${Math.ceil(
            (delta.width / pageInfo.width) * 100 + parseInt(String(width)),
          )}%`
        } else {
          w = Math.ceil(delta.width + width)
        }

        if (String(height).includes('%')) {
          h = `${Math.ceil(
            (delta.height / pageInfo.height) * 100 + parseInt(String(height)),
          )}%`
        } else {
          h = Math.ceil(delta.height + height)
        }

        onValueChange(id, {
          width: w,
          height: h,
        })
      },
      [
        height,
        id,
        onStopPropagation,
        onValueChange,
        pageInfo.height,
        pageInfo.width,
        width,
      ],
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
        scale={scale}
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
        // onMouseEnter={handleSelect}
        // onMouseLeave={handleCancelSelect}
      >
        {children}
      </Rnd>
    )
  },
)

export default Drag
