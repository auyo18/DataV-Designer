import { BasicType } from '@/types/basic'

interface CodeType extends BasicType {
  code: string // 编码
  type: string // 类别
  rule: string // 编码规则
  regex: string // 正则表达式
  is_print: string // 是否打印
  print_type: string // 打印类型
  repeat_num: number // 重复个数
  remark: string // 备注
}
