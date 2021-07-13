import { BasicType } from '@/types/basic'

export interface SupplierType extends BasicType {
  name: string // 名称
  address: string // 地址
  representative: string // 法人
  contact: string // 联系人
  phone: string // 联系电话
  company_phone: string // 公司电话
  fax: string // 传真
  email: string // Email
  url: string // 网址
  score: number // 评价
  remark: string // 备注
  status: string // 状态:禁用:0;10启用
}
