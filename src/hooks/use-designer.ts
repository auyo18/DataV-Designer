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
      name = '0',
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

  // TODO:优化，找到当前更改的组件后就可以退出递归，只更新所在路径的数据
  const onWidgetChange = useCallback(
    (uniqueId, value) => {
      if (!widgets) return

      const rec = (list: DragWidgetTypes[]) => {
        const temp: DragWidgetTypes[] = []

        for (const k in list) {
          const t = { ...list[k] }
          if (t.uniqueId === uniqueId) {
            temp[k] = {
              ...t,
              ...value,
              position: {
                ...t.position,
                ...value.position,
              },
            }
          } else {
            temp[k] = t
          }

          if (t.children) {
            t.children = rec(t.children)
          }
        }

        return temp
      }

      const _widgets = rec(widgets)

      setDragFlatten(dispatch, flattenWidgets({ children: _widgets }))

      setDragWidgets(dispatch, rec(_widgets))
    },
    [dispatch, flattenWidgets, widgets],
  )

  const onFlattenChange = useCallback(
    (newFlatten: DragModelState['flatten']) => {
      const rec = (flatten?: {
        parent: string
        children: string[]
        widget: DragWidgetTypes
      }) => {
        let _widgets: DragWidgetTypes[] = []
        flatten?.children?.forEach(id => {
          const children = rec(newFlatten?.[id])

          if (newFlatten?.[id].widget) {
            _widgets.push({ ...newFlatten[id].widget, children })
          }
        })

        return _widgets
      }

      setDragFlatten(dispatch, newFlatten)

      setDragWidgets(dispatch, rec(newFlatten?.['0']))
    },
    [dispatch],
  )

  const addWidget = useCallback(
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

      onFlattenChange(newFlatten)

      setDragSelected(dispatch, [uniqueId])

      return { newWidget, newFlatten, newWidgets: _widgets }
    },
    [dispatch, flattenWidgets, onFlattenChange, widgets],
  )

  return {
    separator,
    widgets,
    currentWidget,
    dragging,
    selected,
    flatten,
    ...rest,
    onWidgetChange,
    onFlattenChange,
    flattenWidgets,
    addWidget,
  }
}

export default useDesigner
