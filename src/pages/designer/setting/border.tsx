import { memo } from 'react'
import { Collapse, Form, Typography } from 'antd'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { Color } from '@/components'

const { Text } = Typography,
  { Panel } = Collapse

const Border = memo(() => {
  return (
    <Collapse bordered={false} defaultActiveKey={['basic']}>
      <Panel header="基本属性" key="basic">
        <ProForm.Group size="small" title="位置尺寸">
          <ProFormText
            width={150}
            name="width"
            placeholder="宽度"
            allowClear={false}
            rules={[
              {
                pattern: /^\d+%?$/,
                message: '格式不正确',
              },
            ]}
            fieldProps={{
              suffix: <Text type="secondary">W</Text>,
            }}
          />
          <ProFormText
            width={150}
            name="height"
            placeholder="高度"
            allowClear={false}
            rules={[
              {
                pattern: /^\d+%?$/,
                message: '格式不正确',
              },
            ]}
            fieldProps={{
              suffix: <Text type="secondary">H</Text>,
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
        <Form.Item name="color" label="字体颜色">
          <Color />
        </Form.Item>
        <Form.Item name="background" label="背景颜色">
          <Color />
        </Form.Item>
      </Panel>
    </Collapse>
  )
})

export default Border
