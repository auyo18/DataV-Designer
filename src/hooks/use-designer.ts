import { useSelector } from '@/hooks/index'
import { useCallback, useMemo } from 'react'
import { setDragFlatten, setDragWidgets } from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { DragWidgetTypes } from '@/types'
import { DragModelState } from '@/models/drag/model'

const separator = '-'

const useDesigner = () => {
  const dispatch = useDispatch()
  const { widgets, dragging, selected, flatten, ...rest } = useSelector(
    state => state.drag,
  )

  const currentWidget = useMemo(() => {
    return selected && flatten?.[selected]?.widget
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
          _widget.id = String(_widget.id)
          children.push(_widget.id)
          flattenWidgets(
            _widget,
            String(_widget.id),
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
    (id, value) => {
      if (!widgets) return

      const rec = (list: DragWidgetTypes[]) => {
        const temp: DragWidgetTypes[] = []

        for (const k in list) {
          const t = { ...list[k] }
          if (t.id === id) {
            temp[k] = {
              ...t,
              position: {
                ...t.position,
                ...value,
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
  }
}

export default useDesigner
