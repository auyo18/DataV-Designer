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

  const currentWidget = useMemo(() => {
    return widgets?.find(widget => widget.id === selected)
  }, [selected, widgets])

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
