import { BasicType } from '@/types/basic'

interface SignatureType extends BasicType {
  name: string // 名称
  password: string // 密码(MD5)
  signature: string // 签名
}
