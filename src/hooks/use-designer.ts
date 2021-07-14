import { useSelector } from '@/hooks/index'
import { useCallback, useMemo } from 'react'
import { setDragWidgets } from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { DragWidgetTypes } from '@/types'

const useDesigner = () => {
  const dispatch = useDispatch()
  const { widgets, dragging, selected, ...rest } = useSelector(
    state => state.drag,
  )

  const findItem = useCallback((list, id) => {
    if (!list) return
    let current: DragWidgetTypes
    const rec = (list: DragWidgetTypes[]) => {
      for (const k in list) {
        const t = list[k]
        if (t.id === id) {
          current = t
          return true
        }

        if (t.children) {
          if (rec(t.children)) return
        }
      }
    }

    rec(list)

    return current!
  }, [])

  const currentWidget = useMemo(() => {
    return findItem(widgets, selected)
  }, [findItem, selected, widgets])

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

  return {
    widgets,
    currentWidget,
    dragging,
    selected,
    ...rest,
    onWidgetChange,
  }
}

export default useDesigner
