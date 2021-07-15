import { useSelector } from '@/hooks/index'
import { useCallback, useMemo } from 'react'
import { setDragWidgets } from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { DragWidgetTypes } from '@/types'
import { DragModelState } from '@/models/drag/model'

const useDesigner = () => {
  const dispatch = useDispatch()
  const { widgets, dragging, selected, flatten, ...rest } = useSelector(
    state => state.drag,
  )

  const currentWidget = useMemo(() => {
    return selected && flatten?.[selected]?.widget
  }, [flatten, selected])

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

      setDragWidgets(dispatch, rec(widgets))
    },
    [dispatch, widgets],
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

      setDragWidgets(dispatch, rec(newFlatten?.['#']))
    },
    [dispatch],
  )

  return {
    widgets,
    currentWidget,
    dragging,
    selected,
    flatten,
    ...rest,
    onWidgetChange,
    onFlattenChange,
  }
}

export default useDesigner
