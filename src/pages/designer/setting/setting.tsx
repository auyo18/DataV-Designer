import { memo, useCallback, useEffect, useMemo } from 'react'
import { Form } from 'antd'
import ProForm from '@ant-design/pro-form'
import { useDesigner } from '@/hooks'
import Page from './page'
import Border from './border'
import { setDragPageInfo } from '@/models/drag/actions'
import { useDispatch } from 'umi'

const Setting = memo(() => {
  const dispatch = useDispatch()

  const { pageInfo, currentWidget, selected, onWidgetChange } = useDesigner()

  const [form] = Form.useForm()

  const setFormData = useCallback(() => {
    if (selected && currentWidget?.position) {
      form.setFieldsValue({
        ...currentWidget,
        ...currentWidget?.position,
      })
    } else {
      form.setFieldsValue({
        size: `${pageInfo.width}*${pageInfo.height}`,
        ...pageInfo,
      })
    }
  }, [currentWidget, form, pageInfo, selected])

  const { content, onValuesChange } = useMemo(() => {
    switch (currentWidget?.type) {
      case 'border':
        return {
          content: <Border />,
          onValuesChange(values: any) {
            onWidgetChange(selected, values)
          },
        }
      default:
        return {
          content: <Page />,
          onValuesChange(values: any) {
            if (values.size) {
              const [width, height] = values.size.split('*')
              form.setFieldsValue({
                width,
                height,
              })

              setDragPageInfo(dispatch, {
                width,
                height,
              })
            } else {
              setDragPageInfo(dispatch, values)
            }
          },
        }
    }
  }, [currentWidget?.type, dispatch, form, onWidgetChange, selected])

  useEffect(() => {
    setFormData()
  }, [setFormData])

  return (
    <ProForm
      form={form}
      layout="horizontal"
      submitter={{ render: () => null }}
      onValuesChange={onValuesChange}
    >
      {content}
    </ProForm>
  )
})

export default Setting
