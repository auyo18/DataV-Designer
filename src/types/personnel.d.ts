import { BasicType } from '@/types/basic'

// 人员职能
export interface PersonnelAbilityType extends BasicType {
  user_id: number // 员工 ID
  user_code: string // 员工编号
  user_name: string // 员工姓名
  type: string // 职能类型,字典(采样,分析)
  test_category_id: number // 检测类别ID
  project_name: string // 项目名称:多个检测项目名称;分隔
  file_flag: string[] // 上岗证
}
