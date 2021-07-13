// 设备
import { BasicType } from '@/types/basic'

interface DeviceType extends BasicType {
  device_id: number // 设备ID
  name: string // 名称
  alias: string // 设备别名
  model: string // 规格型号
  facturer: string // 生产厂家
  factory_number: string // 出厂编号
  facturer_phone: string // 厂家电话
  supplier_id: number // 供应商ID
  after_sales_phone: string // 售后电话
  buy_date: string // 购买日期
  warranty_date: string // 保修期
  scrap_date: string // 报废日期
  traceability: string // 溯源方式,字典(校准,检定)
  verify_cycle: string // 检定周期,字典(1月,6月,1年,2年)
  due_reminder: string // 到期提醒(天)
  use_dept_id: number // 使用部门ID
  use_dept: string // 使用部门
  manager_id: number // 管理员ID
  manager: string // 管理员
  category: string // 类别
  specification: string // 主要技术指标
  definition: string // 精确度/不确定度
  picture_flag: string // 图像
  attachment_flag: string // 附件标识
  remark: string // 备注
  status: string // 状态:-10:报废;0:维修中;10:借出:20:在库
}
