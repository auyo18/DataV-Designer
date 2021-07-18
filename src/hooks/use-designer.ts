import { useSelector } from '@/hooks/index'
import { useCallback, useMemo } from 'react'
import {
  setDragFlatten,
  setDragSelected,
  setDragWidgets,
} from '@/models/drag/actions'
import { v4 as uuidV4 } from 'uuid'
import { useDispatch } from 'umi'
import { DragWidgetTypes } from '@/types'
import { DragModelState } from '@/models/drag/model'
import { flattenTopName } from '@/constants'

const separator = '/'

const useDesigner = () => {
  const dispatch = useDispatch()
  const { widgets, dragging, selected, flatten, ...rest } = useSelector(
    state => state.drag,
  )

  const currentWidget = useMemo(() => {
    return selected && selected.length === 1
      ? flatten?.[selected[0]]?.widget
      : undefined
  }, [flatten, selected])

  const flattenWidgets = useCallback(
    (
      widget,
      name = flattenTopName,
      parent?,
      result = {},
      totalX: number = 0,
      totalY: number = 0,
    ) => {
      const children = [],
        widgets = widget.children

      for (const k in widgets) {
        if (Object.prototype.hasOwnProperty.call(widgets, k)) {
          const _widget = widgets[k]
          children.push(_widget.uniqueId)
          flattenWidgets(
            _widget,
            _widget.uniqueId,
            (parent ? parent + separator : '') + name,
            result,
            totalX + _widget.position.left,
            totalY + _widget.position.top,
          )
        }
      }

      result[name] = {
        parent,
        widget: { ...widget, children: undefined },
        children,
        totalX,
        totalY,
      }
      return result
    },
    [],
  )

  const onFlattenChange = useCallback(
    (newFlatten: DragModelState['flatten']) => {
      const rec = (
        ids?: string[],
        x: number = Infinity,
        y: number = Infinity,
        w: number = -Infinity,
        h: number = -Infinity,
      ) => {
        if (!ids) return {}

        let widgets: DragWidgetTypes[] = [],
          top = y,
          left = x,
          right = w,
          bottom = h

        ids?.forEach(id => {
          const {
              widgets: children,
              top: _top,
              left: _left,
              right: _right,
              bottom: _bottom,
            } = rec(newFlatten?.[id].children, x, y, w, h),
            newWidget = newFlatten?.[id].widget,
            position = newWidget?.position

          if (newWidget && position) {
            top = Math.min(top, position?.top)
            left = Math.min(left, position?.left)
            right = Math.max(right, position?.width + position?.left)
            bottom = Math.max(bottom, position?.height + position?.top)

            widgets.push({
              ...newWidget,
              position: {
                ...position,
                top: _top != null && _top !== Infinity ? _top : position.top,
                left:
                  _left != null && _left !== Infinity ? _left : position.left,
                width:
                  _right != null && _left != null && _right !== -Infinity
                    ? _right - _left
                    : position.width,
                height:
                  _bottom != null && _top != null && _bottom !== -Infinity
                    ? _bottom - _top
                    : position.height,
              },
              children,
            })
          }
        })

        return { widgets, top, left, right, bottom }
      }

      setDragFlatten(dispatch, newFlatten)
      setDragWidgets(
        dispatch,
        rec(newFlatten?.[flattenTopName].children)?.widgets,
      )
    },
    [dispatch],
  )

  // TODO:优化，找到当前更改的组件后就可以退出递归，只更新所在路径的数据
  const onWidgetChange = useCallback(
    (uniqueId: string | true, value?: any, _widgets = widgets) => {
      const widgets = _widgets
      if (!widgets) return
      const rec = (
        list: DragWidgetTypes[],
        diffX: number = 0,
        diffY: number = 0,
        hasParent: boolean = false,
      ) => {
        let temp: DragWidgetTypes[] = []

        for (const k in list) {
          let t = { ...list[k], hasParent },
            _diffX = 0,
            _diffY = 0
          if (typeof uniqueId === 'boolean' || t.uniqueId === uniqueId) {
            if (t.uniqueId === uniqueId) {
              _diffX = t.position.left - value.position.left
              _diffY = t.position.top - value.position.top
            }

            temp[k] = {
              ...t,
              ...value,
              position: {
                ...t.position,
                ...value?.position,
              },
            }
          } else {
            temp[k] = {
              ...t,
              position: {
                ...t.position,
                left: t.position.left - diffX,
                top: t.position.top - diffY,
              },
            }
          }

          if (temp[k].children) {
            temp[k].children = rec(
              temp[k].children!,
              _diffX + diffX,
              _diffY + diffY,
              true,
            )
          }
        }
        return temp
      }

      onFlattenChange(flattenWidgets({ children: rec(widgets) }))
    },
    [flattenWidgets, onFlattenChange, widgets],
  )

  const handleAddWidget = useCallback(
    widget => {
      const _widgets = widgets ? [...widgets] : [],
        uniqueId = uuidV4(),
        newWidget = {
          ...widget,
          uniqueId,
          position: {
            ...widget.position,
            left: widget.position.left || 0,
            top: widget.position.top || 0,
          },
        }

      _widgets?.unshift(newWidget)

      const newFlatten = flattenWidgets({ children: _widgets })

      return { newWidget, newFlatten, newWidgets: _widgets }
    },
    [flattenWidgets, widgets],
  )

  const addWidget = useCallback(
    widget => {
      const { newWidget, newFlatten } = handleAddWidget(widget)

      onFlattenChange(newFlatten)

      setDragSelected(dispatch, [newWidget.uniqueId])
    },
    [dispatch, handleAddWidget, onFlattenChange],
  )

  return {
    ...rest,
    separator,
    widgets,
    currentWidget,
    dragging,
    selected,
    flatten,
    onWidgetChange,
    onFlattenChange,
    flattenWidgets,
    addWidget,
    handleAddWidget,
  }
}

export default useDesigner
