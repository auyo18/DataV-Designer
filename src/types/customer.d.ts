import { BasicType } from '@/types/basic'

// 客户
export interface CustomerType extends BasicType {
  name: string // 名称
  address: string // 公司地址
  score: string // 评价
  service: string // 服务内容
  remark: string // 备注
  attachment_flag: string // 附件标识
  status: string // 状态:10:潜在客户;20:跟进中;30:服务中;50:完成服务
}

// 客户联系人
export interface CustomerContactType extends BasicType {
  name: string // 姓名
  phone: string // 电话
  position: string // 职务
  is_main: string // 是否主要联系人
}

// 合同
export interface ContractType extends BasicType {
  contract_change_id: number // 合同变更ID
  contractCode: string // 合同编号
  contract_code: string // 合同编号
  pre_contract_version: string // 上一版本
  contract_version: string // 合同版本
  manager_id: number // 负责人ID
  project_name: string // 项目名称
  customer_id: number // 客户ID
  customer_address: string // 客户地址
  customer_contact: string // 联系人
  customer_phone: string // 电话
  signing_date: string // 签订日期
  fulfill_start_date: string // 履行日期起
  fulfill_end_date: string // 履行日期止
  invoice_name: string // 开票_名称
  invoice_tax_number: string // 开票_税号
  invoice_address: string // 开票_单位地址
  invoice_phone: string // 开票_电话号码
  invoice_bank: string // 开票_开户银行
  invoice_account: string // 开票_银行账号
  settle_remark: string // 结算_备注
  settle_first_date: string // 结算_首款日期
  settle_first_rate: string // 结算_首款比例
  settle_first_amount: string // 结算_首款金额
  total_amount: string // 总金额(所有检测项目费用+其他费用)
  discount_amount: string // 优惠金额
  contract_amount: string // 执行金额(总金额-优惠金额)
  attachment_flag: string // 附件标识
  remark: string // 备注
  status: string // 状态:-10:作废;0:草稿;10:待审核;20:已审核;30:服务中;50:终止;60:完成
  fileCount: number // 自定义文件数量
}

// 合同 - 检测类别
export interface ContractDetectionCategoryType extends BasicType {
  contract_code: string // 合同编号
  test_category_id: number // 检测类别ID
  test_num: number // 检测次数
  report_num: number // 报告份数/次
  contractCode: string // 合同编号
}

// 合同 - 其他费用
export interface ContractOtherFeeType extends BasicType {
  contract_code: string // 合同编号
  price_definition_id: number // 费用名称ID
  price: number // 费用金额
}

// 合同 - 点位项目
export interface ContractPointProjectType extends BasicType {
  contract_point_guid: string // 合同点位GUID
  contract_code: string // 合同编号
  contract_test_id: number // 合同服务类别ID
  contract_test_point_id: number // 合同检测点位ID
  test_project_id: number // 检测项目ID
  test_project_name: string // 检测项目名称
  price: number // 检测费用
  remark: string // 备注
}

// 合同 - 检测点位
export interface ContractTestPointType extends BasicType {
  contract_point_guid: string // 合同点位GUID
  contract_code: string // 合同编号
  contract_test_id: number // 合同服务类别ID
  code: string // 点位编码
  name: string // 点位名称
}

// 合同 - 检测任务
export interface ContractTestTaskType extends BasicType {
  contract_task_guid: string // 合同任务编码:(GUID唯一编码)
  contract_task_serial: string // 合同任务序号(当前检测任务的序号)
  contract_code: string // 合同编号
  contract_test_id: string // 合同服务类别ID
  task_time: string // 预计任务时间
  report_time: string // 报告完成时间
}
