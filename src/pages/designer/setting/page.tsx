import { memo } from 'react'
import ProCard from '@ant-design/pro-card'
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { Typography, Form } from 'antd'
import { Color } from '@/components'

const { Text } = Typography

const Page = memo(() => {
  return (
    <ProCard title="页面属性">
      <ProFormSelect
        label="屏幕大小"
        name="size"
        valueEnum={{
          '1920*1080': {
            text: '1920*1080 (推荐)',
          },
          '1440*960': {
            text: '1440*960',
          },
          '1366*768': {
            text: '1366*768',
          },
          '1024*768': {
            text: '1024*768',
          },
        }}
      />
      <ProForm.Group size="small">
        <ProFormText
          width={150}
          placeholder="宽度"
          allowClear={false}
          name="width"
          fieldProps={{
            suffix: <Text type="secondary">W</Text>,
            type: 'number',
            min: 1,
          }}
        />
        <ProFormText
          width={150}
          placeholder="高度"
          allowClear={false}
          name="height"
          fieldProps={{
            suffix: <Text type="secondary">Y</Text>,
            type: 'number',
            min: 1,
          }}
        />
      </ProForm.Group>
      <Form.Item name="backgroundColor" label="背景颜色">
        <Color />
      </Form.Item>
    </ProCard>
  )
})

export default Page
