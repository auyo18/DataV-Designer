import { FormItemProps, InputProps } from 'antd'
import React from 'react'
import { ExtendsProps } from '@ant-design/pro-form/lib/BaseForm/createField'
import { FieldProps, FooterRender } from '@ant-design/pro-form/lib/interface'

export interface ProFormTextProps extends FormItemProps, ExtendsProps {
  fieldProps?: (FieldProps & InputProps) | undefined
  placeholder?: string | string[] | undefined
  secondary?: boolean | undefined
  allowClear?: boolean | undefined
  disabled?: boolean | undefined
  width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg' | undefined
  proFieldProps?:
    | {
        light?: boolean | undefined
        emptyText?: React.ReactNode
        label?: React.ReactNode
        mode?: 'read' | undefined
        proFieldKey?: string | undefined
        render?: any
      }
    | undefined
  footerRender?: FooterRender | undefined
}
