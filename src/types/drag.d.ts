export interface DragWidgetTypes {
  id: number
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
