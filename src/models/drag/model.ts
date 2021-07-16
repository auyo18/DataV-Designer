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
  selected?: string[] // 选中 id
  hovered?: number | string // 悬停 id
  shifted: boolean // 是否按下 shift 键
  controlled: boolean // 是否按下 ctrl 键
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
    SET_SELECTED_MULTIPLE: Reducer<DragModelState>
    SET_CONTROLLED: Reducer<DragModelState>
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
    selected: [],
    shifted: false,
    controlled: false,
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
      if (state?.dragging === payload) return state!

      return Object.assign({}, state, {
        dragging: payload,
      })
    },
    SET_SELECTED: (state, { payload }) => {
      const selected = state?.selected
      if (
        selected?.length === payload?.length &&
        selected?.[0] === payload?.[0]
      )
        return state!

      return Object.assign({}, state, {
        selected: payload,
      })
    },
    SET_SELECTED_MULTIPLE: (state, { payload }) => {
      const selected = state?.selected ? [...state?.selected] : [],
        idx = selected?.indexOf(payload)

      if (idx != null && idx > -1) {
        selected?.splice(idx, 1)
      } else {
        selected?.push(payload)
      }

      return Object.assign({}, state, {
        selected,
      })
    },
    SET_HOVERED: (state, { payload }) => {
      if (state?.hovered === payload) return state!

      return Object.assign({}, state, {
        hovered: payload,
      })
    },
    SET_SHIFTED: (state, { payload }) => {
      if (state?.shifted === payload) return state!

      return Object.assign({}, state, {
        shifted: payload,
      })
    },
    SET_CONTROLLED: (state, { payload }) => {
      if (state?.controlled === payload) return state!

      return Object.assign({}, state, {
        controlled: payload,
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
