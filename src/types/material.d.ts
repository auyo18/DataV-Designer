import { BasicType } from '@/types/basic'

interface MaterialType extends BasicType {
  code: string // 编码
  name: string // 名称
  alias: string // 设备别名
  model: string // 规格型号
  facturer: string // 生产厂家
  factory_number: string // 出厂编号
  facturer_phone: string // 厂家电话
  type: string // 类型(10:耗材;20:试剂;30:标准物质)
  unit: string // 单位,字典(eg:g,l,ml,mg)
  default_location: string // 默认存放位置,字典(eg:仓库A)
  is_recycle: string // 是否回收
  max_inventory: string // 库存上限
  min_inventory: string // 库存下限
  due_reminder: string // 到期提醒(天)
  temperature: string // 保管温度
  humidity: string // 保管湿度
  safety_store: string // 安全说明_存储,字典
  safety_use: string // 安全说明_使用,字典
  safety_dangerous: string // 安全说明_危险性,字典
  safety_explosive: string // 安全说明_易制爆,字典
  safety_narcotics: string // 安全说明_易制毒,字典
  picture_flag: string // 图像
  attachment_flag: string // 附件标识
  inventory: string // 库存
  remark: string // 备注
  status: string // 状态:-10:报废;0:禁用;10启用
}
