import { Drag } from '@/components'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import {
  setDragClickTime,
  setDragFlatten,
  setDragPageInfo,
  setDragSelected,
  setDragShifted,
  setDragWidgets,
} from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { Row, Col } from 'antd'
import Layer from './layer'
import Setting from './setting'
import { useDebounce, useDesigner } from '@/hooks'
import './designer.scss'
import { DragWidgetTypes } from '@/types'

const shiftKeyName = 'Shift',
  leftWidth = 200,
  settingWidth = 360,
  _widgets = [
    {
      id: 1,
      type: 'border',
      position: {
        width: '40%',
        height: '20%',
        left: 100,
        top: 50,
      },
      children: [
        {
          id: 3,
          type: 'border',
          position: {
            width: 400,
            height: 250,
            left: 100,
            top: 60,
          },
          children: [
            {
              id: 4,
              type: 'border',
              position: {
                width: 50,
                height: 100,
                left: 200,
                top: 100,
              },
            },
          ],
        },
      ],
    },
    {
      id: 2,
      type: 'border',
      position: {
        width: 400,
        height: 250,
        left: 700,
        top: 160,
      },
    },
  ]

export default function Designer() {
  const dispatch = useDispatch()
  const { pageInfo, widgets, onWidgetChange } = useDesigner()
  const [widowWidth, setWindowWidth] = useState(document.body.offsetWidth)

  const flattenWidgets = useCallback(
    (widget, name = '#', parent?, result = {}) => {
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
            (parent ? parent + '/' : '') + name,
            result,
          )
        }
      }

      result[name] = {
        parent,
        widget: { ...widget, children: undefined },
        children,
      }
      return result
    },
    [],
  )

  const initialState = useCallback(() => {
    setDragPageInfo(dispatch, {
      width: 1920,
      height: 1080,
      backgroundColor: '#181b24',
    })

    setDragFlatten(dispatch, flattenWidgets({ children: _widgets }))

    setDragWidgets(dispatch, _widgets)
  }, [dispatch, flattenWidgets])

  const { scale, screenContainerStyles } = useMemo((): {
    scale: number
    screenContainerStyles: CSSProperties
  } => {
    const width = parseInt(pageInfo.width) || 1920,
      scale = (widowWidth - leftWidth - settingWidth) / width
    return {
      scale,
      screenContainerStyles: {
        width,
        height: parseInt(pageInfo.height) || 1080,
        backgroundColor: pageInfo.backgroundColor || '#181b24',
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
        transition: 'all .2s',
      },
    }
  }, [pageInfo.backgroundColor, pageInfo.height, pageInfo.width, widowWidth])

  const onValueChange = useCallback(
    (id, data) => {
      onWidgetChange(id, data)
    },
    [onWidgetChange],
  )

  const handleClick = useCallback(
    e => {
      const className = e.target.className
      if (className.includes('screen') || className.includes('container')) {
        // 点击外部清空选中组件
        setDragSelected(dispatch, undefined)
      }
      setDragClickTime(dispatch, Date.now())
    },
    [dispatch],
  )

  const onShiftKeydownHandle = useCallback(
    ({ key }) => {
      if (key === shiftKeyName) setDragShifted(dispatch, true)
    },
    [dispatch],
  )

  const onShiftKeyupHandle = useCallback(
    ({ key }) => {
      if (key === shiftKeyName) setDragShifted(dispatch, false)
    },
    [dispatch],
  )

  const onResizeHandle = useDebounce(
    useCallback(e => {
      setWindowWidth(document.body.offsetWidth)
    }, []),
  )

  const bindEvent = useCallback(() => {
    window.addEventListener('keydown', onShiftKeydownHandle)
    window.addEventListener('keyup', onShiftKeyupHandle)
    window.addEventListener('blur', () =>
      onShiftKeyupHandle({ key: shiftKeyName }),
    )
    window.addEventListener('resize', onResizeHandle)
  }, [onResizeHandle, onShiftKeydownHandle, onShiftKeyupHandle])

  useEffect(() => {
    bindEvent()
    return () => {
      onShiftKeyupHandle({ key: shiftKeyName })
    }
  }, [bindEvent, onShiftKeyupHandle])

  useEffect(() => {
    initialState()
  }, [initialState])

  return (
    <Row className="designer">
      <Col className="left" style={{ width: leftWidth }}>
        <Layer />
      </Col>
      <Col className="screen" onClick={handleClick}>
        <div className="container" style={screenContainerStyles}>
          {widgets?.map(widget => (
            <Drag
              key={widget.id}
              value={widget}
              onValueChange={onValueChange}
              scale={scale}
            >
              {widget.id}
              {widget.children?.map(item => (
                <Drag
                  key={item.id}
                  value={item}
                  onValueChange={onValueChange}
                  scale={scale}
                >
                  {item.id}
                </Drag>
              ))}
            </Drag>
          ))}
        </div>
      </Col>
      <Col className="setting" style={{ width: settingWidth }}>
        <Setting />
      </Col>
    </Row>
  )
}
