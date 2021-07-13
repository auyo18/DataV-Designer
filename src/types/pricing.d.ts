import { BasicType } from '@/types/basic'

export interface PointPricingType extends BasicType {
  type: string // 定位类型
  category: string // 检测类型
  price: string // 价格
  description: string // 价格说明
}

// 项目定价
export interface ProjectPricingType extends BasicType {
  type: string // 定位类型
  project: string // 检测项目
  price: string // 价格
  description: string // 价格说明
  status: string // 状态
}

// 其他费用
export interface OtherPricingType extends BasicType {
  type: string // 定位类型
  name: string // 费用名称
  price: string // 价格
  description: string // 价格说明
}
