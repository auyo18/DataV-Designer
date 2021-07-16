import { Drag } from '@/components'
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import {
  setDragClickTime,
  setDragControlled,
  setDragFlatten,
  setDragPageInfo,
  setDragSelected,
  setDragShifted,
  setDragWidgets,
} from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { Row, Col } from 'antd'
import Layer from './layer/layer'
import Setting from './setting'
import Header from './header/header'
import { useDebounce, useDesigner } from '@/hooks'
import './designer.scss'
import { DragWidgetTypes } from '@/types'

const shiftKeyName = 'Shift',
  ctrlKeyName = 'Control',
  leftWidth = 255,
  settingWidth = 360,
  _widgets: DragWidgetTypes[] = [
    {
      id: 1,
      uniqueId: '123123-123123qwerdf-xqw3wetr',
      name: '边框',
      type: 'border',
      position: {
        width: 400,
        height: 500,
        left: 100,
        top: 50,
      },
    },
    {
      id: 2,
      uniqueId: '123-123123qwzxvczxercvzxdf-xqw3wetr',
      name: '面积图',
      type: 'border',
      position: {
        width: 400,
        height: 250,
        left: 700,
        top: 160,
      },
    },
    {
      id: 3,
      uniqueId: 'sdf124-123123qwerdf-xqw3wetr',
      name: '面积图',
      type: 'border',
      position: {
        width: 400,
        height: 250,
        left: 100,
        top: 60,
      },
    },
    {
      id: 4,
      uniqueId: '123123-ewrwr-xqw3wetr',
      name: '文字',
      type: 'border',
      position: {
        width: 50,
        height: 100,
        left: 200,
        top: 100,
      },
    },
  ]

export default function Designer() {
  const dispatch = useDispatch()
  const { pageInfo, widgets, flattenWidgets, onWidgetChange } = useDesigner()
  const [widowWidth, setWindowWidth] = useState(document.body.offsetWidth)

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

  const handleLayerClick = useCallback(() => {
    setDragSelected(dispatch, undefined)
  }, [dispatch])

  const handleScreenClick = useCallback(
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

  const onShiftKeydownHandle = useCallback(() => {
    setDragShifted(dispatch, true)
  }, [dispatch])

  const onShiftKeyupHandle = useCallback(() => {
    setDragShifted(dispatch, false)
  }, [dispatch])

  const onCtrlKeydownHandle = useCallback(() => {
    setDragControlled(dispatch, true)
  }, [dispatch])

  const onCtrlKeyupHandle = useCallback(() => {
    setDragControlled(dispatch, false)
  }, [dispatch])

  const onKeydownHandle = useCallback(
    ({ key }) => {
      switch (key) {
        case shiftKeyName:
          onShiftKeydownHandle()
          break
        case ctrlKeyName:
          onCtrlKeydownHandle()
          break
      }
    },
    [onCtrlKeydownHandle, onShiftKeydownHandle],
  )

  const onKeyupHandle = useCallback(
    ({ key }) => {
      switch (key) {
        case shiftKeyName:
          onShiftKeyupHandle()
          break
        case ctrlKeyName:
          onCtrlKeyupHandle()
          break
      }
    },
    [onCtrlKeyupHandle, onShiftKeyupHandle],
  )

  const onResizeHandle = useDebounce(
    useCallback(() => {
      setWindowWidth(document.body.offsetWidth)
    }, []),
  )

  const onHandleBlur = useCallback(() => {
    onShiftKeyupHandle()
    onCtrlKeyupHandle()
  }, [onCtrlKeyupHandle, onShiftKeyupHandle])

  const bindEvent = useCallback(() => {
    window.addEventListener('keydown', onKeydownHandle)
    window.addEventListener('keyup', onKeyupHandle)
    window.addEventListener('blur', onHandleBlur)
    window.addEventListener('resize', onResizeHandle)
  }, [onHandleBlur, onKeydownHandle, onKeyupHandle, onResizeHandle])

  const createDrag = useCallback(() => {
    const rec = (list: DragWidgetTypes[]) => {
      if (!list) return

      const d: any[] = []
      for (let i = 0, length = list.length - 1; i <= length; i++) {
        const item = list[i]
        d[length - i] = (
          <Drag
            key={item.uniqueId}
            value={item}
            onValueChange={onValueChange}
            scale={scale}
          >
            <div>{item.name}</div>
            {item.children && rec(item.children)}
          </Drag>
        )
      }
      return d
    }

    return rec(widgets!)
  }, [onValueChange, scale, widgets])

  useEffect(() => {
    bindEvent()
    return onHandleBlur
  }, [bindEvent, onHandleBlur, onCtrlKeyupHandle, onShiftKeyupHandle])

  useEffect(() => {
    initialState()
  }, [initialState])

  return (
    <div>
      <Header />
      <Row className="designer">
        <Col
          className="layer"
          style={{ width: leftWidth, height: '100%' }}
          onClick={handleLayerClick}
        >
          <Layer />
        </Col>
        <Col className="screen" onClick={handleScreenClick}>
          <div className="container" style={screenContainerStyles}>
            {createDrag()}
          </div>
        </Col>
        <Col className="setting" style={{ width: settingWidth }}>
          <Setting />
        </Col>
      </Row>
    </div>
  )
}
