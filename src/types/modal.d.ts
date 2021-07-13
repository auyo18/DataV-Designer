import { Dispatch, SetStateAction } from 'react'
import { ModalProps, FormInstance } from 'antd'
import { DrawerFormProps, ModalFormProps } from '@ant-design/pro-form'

export interface ModalHookProps {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  showModal: () => void
  hideModal: () => void
  modalBasicProps?: ModalProps
}

export interface ModalFormHookProps<T> extends ModalHookProps {
  form: FormInstance
  setForm: (value: T) => void
  resetForm: (reset?: boolean, show?: boolean) => void
  modalFormBasicProps?: ModalFormProps | DrawerFormProps
}
