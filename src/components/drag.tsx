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
    const {
      uniqueId,
      width,
      height,
      left,
      top,
      color,
      background,
      isGroup,
      hasParent,
    } = useMemo(
      () => ({
        ...value,
        ...value.position,
        isGroup: value.type === 'group',
      }),
      [value],
    )

    const dispatch = useDispatch()
    const {
      pageInfo,
      dragging,
      selected,
      hovered,
      shifted,
      clickTime,
      flatten,
      separator,
    } = useDesigner()

    // TODO: 判断当前组内是否组项选中，和是否子项选中，选中相同组员，拖动其他组员，高亮没有取消
    const { isSelected, isGroupSelected, isNotGroupSelected } = useMemo(() => {
      // 当前分组任一项是否选择
      const isSelected =
        // 当前项
        selected?.includes(uniqueId) ||
        selected?.some(id => {
          const item = flatten?.[uniqueId]
          return (
            // 当前项子级
            item?.children.includes(id) ||
            // 当前项父级
            item?.parent.split(separator).includes(id)
          )
        })

      // 当前分组组项是否选择
      const isGroupSelected =
          (isGroup && selected?.includes(uniqueId)) ||
          selected?.some(id => {
            const parents = flatten?.[uniqueId].parent.split(separator),
              item =
                parents?.[parents.length - 1] &&
                flatten?.[parents?.[parents.length - 1]]
            return (
              // 当前项父级
              item &&
              item.widget.type === separator &&
              item.widget.uniqueId === id
            )
          }),
        isNotGroupSelected =
          (!isGroup && selected?.includes(uniqueId)) ||
          selected?.some(id => {
            const parents = flatten?.[uniqueId].parent.split(separator),
              item =
                parents?.[parents.length - 1] &&
                flatten?.[parents?.[parents.length - 1]]
            return (
              // 当前项父级
              item &&
              item.widget.type !== separator &&
              item.widget.uniqueId === id
            )
          })

      return {
        isSelected,
        isGroupSelected,
        isNotGroupSelected,
      }
    }, [flatten, isGroup, selected, separator, uniqueId])

    const hasSelected = useMemo(() => {
      return selected?.includes(uniqueId)
    }, [selected, uniqueId])

    const hasHovered = useMemo(() => {
      return hovered === uniqueId
    }, [hovered, uniqueId])

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
        cursor: isSelected ? 'move' : 'pointer',
        transition: 'border-color .2s',
        background: !isGroup ? background || '#282842b3' : 'transparent',
        zIndex: hasEditing ? 999 : 0,
      }),
      [background, color, hasEditing, isGroup, isSelected],
    )

    // 阻止默认事件、冒泡
    const onStopPropagation = useCallback(e => {
      e.preventDefault()
      e.stopPropagation()
      return
    }, [])

    const clickSelect = useCallback(
      e => {
        if (Date.now() - clickTime <= timeDiff) {
          onStopPropagation(e)
        }

        if (!hasParent || (hasParent && isNotGroupSelected)) {
          setDragSelected(dispatch, [uniqueId])
        }
      },
      [
        clickTime,
        dispatch,
        hasParent,
        isNotGroupSelected,
        onStopPropagation,
        uniqueId,
      ],
    )

    const hoverSelect = useCallback(
      e => {
        if (isSelected) return
        setDragHovered(dispatch, uniqueId)
      },
      [dispatch, isSelected, uniqueId],
    )

    // TODO：BUG，双击后松开鼠标选中项变成顶级元素
    const handleSelect = useCallback(
      (e: Event) => {
        if (!uniqueId || dragging) return
        switch (e.type) {
          case 'mouseover':
            hoverSelect(e)
            break
          case 'click':
            clickSelect(e)
            break
        }
      },
      [clickSelect, dragging, hoverSelect, uniqueId],
    )

    const onDragStartHandle = useCallback(
      e => {
        if (!uniqueId) return
        clickSelect(e)
        setDragDragging(dispatch, true)
      },
      [clickSelect, dispatch, uniqueId],
    )

    const onDragStopHandle = useCallback(
      (e, { x, y }) => {
        if (!uniqueId) return
        onStopPropagation(e)

        if (left !== x || top !== y) {
          onValueChange(uniqueId, {
            position: {
              left: Math.round(x),
              top: Math.round(y),
            },
          })
        }

        setDragDragging(dispatch, false)
      },
      [uniqueId, onStopPropagation, left, top, dispatch, onValueChange],
    )

    const onResizeStopHandle = useCallback(
      (e, dir, ref, delta) => {
        if (!uniqueId) return
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

        onValueChange(uniqueId, {
          position: {
            width: w,
            height: h,
          },
        })
      },
      [
        height,
        onStopPropagation,
        onValueChange,
        pageInfo.height,
        pageInfo.width,
        uniqueId,
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
        onMouseOver={handleSelect}
        onMouseLeave={handleCancelSelect}
      >
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: hasEditing ? 'rgba(38, 129, 255,.7)' : 'transparent',
            transition: 'all .1s',
          }}
        />
        <div
          style={
            isGroup
              ? {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: `translate(${-left}px, ${-top}px)`,
                }
              : {}
          }
        >
          {children}
        </div>
      </Rnd>
    )
  },
)

export default Drag
