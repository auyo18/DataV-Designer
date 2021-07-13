import { BasicType } from '@/types/basic'

interface SampleReceiptType extends BasicType {
  type: string // 收样类型10:采样收样;20:送样收样
  voucher: string // 收样凭证
  send_user_id: number // 送样人
  recipient_user_id: number // 接样人
  recipient_time: string // 收样时间
  attachment_flag: string // 附件标识
  remark: string // 备注
}
