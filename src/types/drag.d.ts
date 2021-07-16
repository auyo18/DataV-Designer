export interface DragWidgetTypes {
  id: string | number
  uniqueId: string
  name: string
  type: string
  position: {
    width: number | string
    height: number | string
    left: number
    top: number
  }
  color?: string
  background?: string
  children?: DragWidgetTypes[]
}
