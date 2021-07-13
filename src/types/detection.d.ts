import { BasicType } from '@/types/basic'

// 标准库
export interface StandardLibraryType extends BasicType {
  code: string // 标准号
  name: string // 标准名称
  release_date: string // 发布时间
  implement_date: string // 实施时间
  repeal_date: string // 废止时间
  last_check_date: string // 最后查新时间
  attachment_flag: string // 附件标识
  replace_code: string // 代替标准
  remark: string // 备注
  status: string // 状态:-10:废止;0:待实施;10实施中
  update_by: string
}

// 查新记录
export interface CheckCateType extends BasicType {
  standard_id: number // 标准库 ID
  check_date: string // 查新时间
  new_standard_code: string // 新标准号
}

// 检测类别
export interface DetectionCategoryType extends BasicType {
  mainName: string // 主分类
  subName: string // 子分类
}

// 检测项目
export interface DetectionProjectType extends BasicType {
  name: string // 项目名称
  code: string //
  standard_name: string //
  test_standard_id: number // 检测标准ID
  test_method: string // 检测方法
  qualification: string // 检测资质,字典(CMA,外包)
  test_out_limit: string // 检出限
  test_out_limit_unit: string //检出限单位,字典(mg,g,l,ml)
  compare_standard_id: number // 判断标准ID
  compare_standard_value: string // 判断标准限量
  compare_standard_unit: string // 判断单位,字典(mg,g,l,ml)
  result_unit: string // 结果单位,字典(mg,g,l,ml)
  qualification_get_date: string // 获得资质日期
  qualification_due_date: string // 资质截至日期
  is_site_analysis: number // 是否现场分析
  status: string // 状态:0:禁用;10:启用
  sampling_device_name: string // 采样设备,多个设备名称使用;分隔
  sampling_material_id: string // 采样耗材,多个耗材ID使用;分隔
  env_parameter_code: string // 环境参数,多个环境参数编码;分隔
}

// 检测项目名称
export interface DetectionProjectNameType extends BasicType {
  project_name: string // 名称
}

// 检测项目套餐
export interface DetectionProjectPackageType extends BasicType {
  category_name: string // 检测类别
  package_name: string // 套餐名称
  status: string // 状态:0:禁用;10:启用
  item_count: string // 项目数量
  test_project_id: string // 项目
}

// 检测附加参数
export interface DetectionAdditionalParamType extends BasicType {
  code: string // 编码
  name: string // 名称
  unit: string // 单位
  source: string // 来源
  description: string // 描述
}
