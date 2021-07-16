import { memo, useCallback } from 'react'
import { Popover, Button } from 'antd'
import { useDesigner } from '@/hooks'
import './header.scss'

const newWidgets = [
  {
    id: 5,
    type: 'border',
    name: '边框',
    position: {
      width: 400,
      height: 250,
    },
  },
  {
    id: 6,
    type: 'border',
    name: '柱状图',
    position: {
      width: 400,
      height: 250,
    },
  },
]

const Header = memo(() => {
  const { addWidget } = useDesigner()

  const handleClick = useCallback(
    widget => () => {
      addWidget(widget)
    },
    [addWidget],
  )

  return (
    <header>
      <Popover
        content={
          <div>
            {newWidgets.map(widget => (
              <Button key={widget.id} onClick={handleClick(widget)}>
                {widget.name}
              </Button>
            ))}
          </div>
        }
      >
        <Button>组件</Button>
      </Popover>
    </header>
  )
})

export default Header
