import { Dispatch } from '@@/plugin-dva/connect'
import { DragModelState } from './model'

export function setDragWidgets(
  dispatch: Dispatch,
  payload: DragModelState['widgets'],
) {
  return dispatch({
    type: 'drag/SET_WIDGETS',
    payload,
  })
}

export function setDragDragging(
  dispatch: Dispatch,
  payload: DragModelState['dragging'],
) {
  return dispatch({
    type: 'drag/SET_DRAGGING',
    payload,
  })
}

export function setDragSelected(
  dispatch: Dispatch,
  payload: DragModelState['selected'],
) {
  return dispatch({
    type: 'drag/SET_SELECTED',
    payload,
  })
}

export function setDragShifted(
  dispatch: Dispatch,
  payload: DragModelState['shifted'],
) {
  return dispatch({
    type: 'drag/SET_SHIFTED',
    payload,
  })
}

export function setDragHovered(
  dispatch: Dispatch,
  payload: DragModelState['hovered'],
) {
  return dispatch({
    type: 'drag/SET_HOVERED',
    payload,
  })
}
