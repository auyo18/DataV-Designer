export interface FormButtonType {
  action: 'submit' | 'execute' | 'back' | 'goto' | 'preview'
}

export interface FormEventType {
  before?: { type: string; function: (arg?: { [key: string]: any }) => any }[]
  after?: { type: string; function: (arg?: { [key: string]: any }) => any }[]
  server?: { type: string; value: 1 | undefined }[]
}

export interface FormEventParamType {
  addons?: {
    onItemChange: (value: any, path: string) => void
    getValue: (path: string) => any
    formData: any
    dataPath: string
    dataIndex: any[]
  }
  data?: any
  history: any
  query?: any
  form: any
  message: any
  request: any
  pageInfo: any
  watchData: any
  onChange?: (arg: any) => void
  utils: {
    dateToTimestamp: (arg: any) => any
    timestampFormat: (arg: any) => any
    createOptionsAndValueEnum: (arg: any) => any
  }
}
