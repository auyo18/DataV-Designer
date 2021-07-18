export interface DragWidgetTypes {
  id: string | number
  uniqueId: string
  name: string
  type: string
  hasParent?: boolean
  position: {
    width: number
    height: number
    left: number
    top: number
  }
  color?: string
  background?: string
  children?: DragWidgetTypes[]
}
