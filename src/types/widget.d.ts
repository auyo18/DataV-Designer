import { BasicType } from '@/types/basic'

export interface BasicWidgetType extends BasicType {
  code: string // 编码
  name: string // 名称
  picture: string // 图片
  properties: string // 属性描述
  datas: string // 数据描述
  help_document: string // 帮助文档
  component: string // 视图地址
}

export interface ApplicationWidgetType extends BasicType {
  base_widget_code: string // 基础组件代码
  title: string // 标题
  show_title: string // 是否显示标题
  properties: string // 属性描述
  data_source_url: string // 数据描述
  permission_code: string // 权限代码
  hyperlink: string // 超链接
}
