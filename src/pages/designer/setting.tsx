import { memo, useCallback, useEffect } from 'react'
import { Typography, Form, Collapse } from 'antd'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { useDebounce, useDesigner } from '@/hooks'
import { Color } from '@/components'

const { Text } = Typography,
  { Panel } = Collapse

const Setting = memo(() => {
  const { currentWidget, selected, onWidgetChange } = useDesigner()

  const [form] = Form.useForm()

  const setFormData = useCallback(() => {
    if (selected && currentWidget?.position) {
      form.setFieldsValue(currentWidget?.position)
    }
  }, [currentWidget?.position, form, selected])

  const onValuesChange = useDebounce(
    useCallback(
      values => {
        onWidgetChange(selected, values)
      },
      [onWidgetChange, selected],
    ),
    150,
  )

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
      <Collapse bordered={false} defaultActiveKey={['basic']}>
        <Panel header="基本属性" key="basic">
          <ProForm.Group size="small" title="位置尺寸">
            <ProFormText
              width={150}
              name="width"
              placeholder="宽度"
              allowClear={false}
              fieldProps={{
                suffix: <Text type="secondary">W</Text>,
                type: 'number',
                min: 1,
              }}
            />
            <ProFormText
              width={150}
              name="height"
              placeholder="高度"
              allowClear={false}
              fieldProps={{
                suffix: <Text type="secondary">H</Text>,
                type: 'number',
                min: 1,
              }}
            />
            <ProFormText
              width={150}
              name="left"
              placeholder="横坐标"
              allowClear={false}
              fieldProps={{
                suffix: <Text type="secondary">X</Text>,
                type: 'number',
                min: 1,
              }}
            />
            <ProFormText
              width={150}
              name="top"
              placeholder="纵坐标"
              allowClear={false}
              fieldProps={{
                suffix: <Text type="secondary">Y</Text>,
                type: 'number',
                min: 1,
              }}
            />
          </ProForm.Group>
        </Panel>
        <Panel header="样式" key="style">
          <Form.Item name="background" label="背景颜色">
            <Color />
          </Form.Item>
        </Panel>
      </Collapse>
    </ProForm>
  )
})

export default Setting
