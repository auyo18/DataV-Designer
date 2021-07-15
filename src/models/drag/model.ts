/**
 * 检测类别
 */

import { Reducer } from '@@/plugin-dva/connect'
import { DragWidgetTypes } from '@/types'

export interface DragModelState {
  pageInfo: any // 页面信息
  widgets?: DragWidgetTypes[] // 组件
  flatten?: {
    [key: string]: {
      parent: string
      children: string[]
      widget: DragWidgetTypes
    }
  } // 组件一维数据
  dragging: boolean // 是否正在移动
  selected?: number // 选中 id
  hovered?: number // 悬停 id
  shifted: boolean // 是否按下 shift 键
  clickTime: number // 点击时间，判断是否双击
}

export interface DragModelType {
  namespace: 'drag'
  state: DragModelState
  reducers: {
    SET_PAGE_INFO: Reducer<DragModelState>
    SET_WIDGETS: Reducer<DragModelState>
    SET_FLATTEN: Reducer<DragModelState>
    SET_DRAGGING: Reducer<DragModelState>
    SET_SELECTED: Reducer<DragModelState>
    SET_HOVERED: Reducer<DragModelState>
    SET_SHIFTED: Reducer<DragModelState>
    SET_CLICK_TIME: Reducer<DragModelState>
  }
}

const DragModel: DragModelType = {
  namespace: 'drag',
  state: {
    pageInfo: {},
    dragging: false,
    shifted: false,
    clickTime: 0,
  },
  reducers: {
    SET_PAGE_INFO: (state, { payload }) => {
      return Object.assign({}, state, {
        pageInfo: {
          ...state?.pageInfo,
          ...payload,
        },
      })
    },
    SET_WIDGETS: (state, { payload }) => {
      return Object.assign({}, state, {
        widgets: payload,
      })
    },
    SET_FLATTEN: (state, { payload }) => {
      return Object.assign({}, state, {
        flatten: payload,
      })
    },
    SET_DRAGGING: (state, { payload }) => {
      return Object.assign({}, state, {
        dragging: payload,
      })
    },
    SET_SELECTED: (state, { payload }) => {
      return Object.assign({}, state, {
        selected: payload,
      })
    },
    SET_HOVERED: (state, { payload }) => {
      return Object.assign({}, state, {
        hovered: payload,
      })
    },
    SET_SHIFTED: (state, { payload }) => {
      return Object.assign({}, state, {
        shifted: payload,
      })
    },
    SET_CLICK_TIME: (state, { payload }) => {
      return Object.assign({}, state, {
        clickTime: payload,
      })
    },
  },
}

export default DragModel
