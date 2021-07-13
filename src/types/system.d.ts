// 公用

// 状态 : 0 => 禁用， 10 => 启用
import { BasicType } from '@/types/basic'

export type statusType = '0' | '10'
export type pageParams = {
  size: number
  page?: number
  start?: number
  sort: any
}

// 组织
export type orgKindsType = 'default' | 'org' | 'dep' | 'pos'
export interface OrgType extends BasicType {
  id: number // ID
  code: string // 代码
  name: string // 名称
  pid?: number // 父ID
  value?: string // 树形结构所需
  orgKind?: string // 组织类别:org,dep,pos,psm
  status?: number // 状态
  path: string // 路径
  children?: OrgType[] // 子项
}

// 用户
export interface UserType extends BasicType {
  userName: string // 工号
  nickname: string // 昵称
  password: string // 密码
  mobilePhone: string // 电话
  email: string // 邮箱
  gender: string // 性别
  avatar: string // 头像
  isAdmin: string // 是否管理员
  path: string // 组织岗位信息
  pid: string // 岗位id
  is_del: number // 是否删除
}

// 通用调用
export interface DefinitionType extends BasicType {
  api: string // 路由
  name: string // 接口名
  modules: string // 模块名
  permission: string // 所需权限
  api_version: string // 接口版本
  status: string // 状态
  description: string // 文档描述
}

export interface DefinitionContentDetailType extends BasicType {
  code: string // 编码
  content_type: string // 内容类型
  description: string // 描述
  exec_type: string // 执行类型
  execute_sql: string // sql语句
  id: number // ID
  is_default_execute: boolean // 是否默认执行
  param: string // 参数
  seq: string // 排序
  sys_api_definition_id: number // 关联主表ID
}

// 通用调用内容参数
export interface DefinitionContentDetailParamType extends BasicType {
  code: string // 参数代码
  name: string // 参数名
  is_required: string // 是否必填
  default_value: string // 默认值
}

// 通用调用维护
export interface DefinitionDefendType extends BasicType {
  definition_insert?: DefinitionType[]
  definition_update?: DefinitionType[]
  content_insert?: DefinitionContentDetailType[]
  content_update?: DefinitionContentDetailType[]
}

// 菜单
export interface MenuType extends BasicType {
  pid: number // 父级 ID
  code: string // 代码
  name: string // 名称
  icon: string // 图标
  url: string // 路径
  component: string // 组件路径
  active_menu: string // 活动菜单
  hidden: number // 菜单是否可见
  noCache: number // 是否缓存
  remark: string // 备注
  authorities: string[] // 功能权限
  status: string // 状态
  title: string // 树形结构所需
  value: string // 树形结构所需
}

// 权限
export interface PermissionType extends BasicType {
  project: string // 项目
  module: string // 模块
  code: string // 代码
  name: string // 名称
  reg_way: string // 注册方式
  remark?: string // 备注
}

// 角色
export interface RoleType extends BasicType {
  name: string // 名称
  status: string // 状态
  remark: string // 备注
  permission: string[] // 权限列表
}

// 系统参数
export interface ParameterType extends BasicType {
  code: string // 代码
  name: string // 名称
  value: string // 值
  remark: string // 备注
}

// 字典
export interface DictType extends BasicType {
  code: string // 代码
  name: string // 名称
  remark: string // 备注
}

// 字典单位
export interface DictValueType extends BasicType {
  code: string // 代码
  name: string // 名称
  remark: string // 备注
  status: string // 状态
}
