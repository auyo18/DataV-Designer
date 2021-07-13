import { useSelector } from '@/hooks/index'
import { useCallback, useMemo } from 'react'
import { setDragWidgets } from '@/models/drag/actions'
import { useDispatch } from 'umi'

const useDesigner = () => {
  const dispatch = useDispatch()
  const { widgets, dragging, selected, hovered, shifted } = useSelector(
    state => ({
      widgets: state.drag.widgets,
      dragging: state.drag.dragging,
      selected: state.drag.selected,
      hovered: state.drag.hovered,
      shifted: state.drag.shifted,
    }),
  )

  const currentWidget = useMemo(() => {
    return widgets?.find(widget => widget.id === selected)
  }, [selected, widgets])

  const onWidgetChange = useCallback(
    (id, value) => {
      if (!widgets) return
      const temp = [...widgets]
      const _widgets = temp.map(t => {
        if (t.id === id) {
          return {
            ...t,
            position: {
              ...t.position,
              ...value,
            },
          }
        }

        return t
      })

      setDragWidgets(dispatch, _widgets)
    },
    [dispatch, widgets],
  )

  return {
    widgets,
    currentWidget,
    dragging,
    selected,
    hovered,
    shifted,
    onWidgetChange,
  }
}

export default useDesigner
