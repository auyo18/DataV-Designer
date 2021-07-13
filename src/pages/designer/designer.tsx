import { Drag } from '@/components'
import { useCallback, useEffect } from 'react'
import {
  setDragClickTime,
  setDragSelected,
  setDragShifted,
  setDragWidgets,
} from '@/models/drag/actions'
import { useDispatch } from 'umi'
import { Row, Col } from 'antd'
import './designer.scss'
import Setting from './setting'
import { useDesigner } from '@/hooks'

const shiftKeyName = 'Shift'

export default function Designer() {
  const dispatch = useDispatch()
  const { widgets, onWidgetChange } = useDesigner()

  const initialState = useCallback(() => {
    setDragWidgets(dispatch, [
      {
        id: 1,
        position: {
          width: 400,
          height: 250,
          left: 100,
          top: 50,
        },
        children: [
          {
            id: 3,
            position: {
              width: 400,
              height: 250,
              left: 100,
              top: 60,
            },
          },
        ],
      },
      {
        id: 2,
        position: {
          width: 400,
          height: 250,
          left: 600,
          top: 160,
        },
      },
    ])
  }, [dispatch])

  const onValueChange = useCallback(
    (id, data) => {
      onWidgetChange(id, data)
    },
    [onWidgetChange],
  )

  const handleClick = useCallback(
    e => {
      // 点击外部清空选中组件
      e.currentTarget === e.target && setDragSelected(dispatch, undefined)
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

  const bindEvent = useCallback(() => {
    window.addEventListener('keydown', onShiftKeydownHandle)
    window.addEventListener('keyup', onShiftKeyupHandle)
    window.addEventListener('blur', () =>
      onShiftKeyupHandle({ key: shiftKeyName }),
    )
  }, [onShiftKeydownHandle, onShiftKeyupHandle])

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
      <Col className="left">left</Col>
      <Col className="screen" onClick={handleClick}>
        {widgets?.map(widget => (
          <Drag key={widget.id} value={widget} onValueChange={onValueChange}>
            6666
            {widget.children?.map(item => (
              <Drag key={item.id} value={item} onValueChange={onValueChange}>
                8888
              </Drag>
            ))}
          </Drag>
        ))}
      </Col>
      <Col className="setting">
        <Setting />
      </Col>
    </Row>
  )
}
