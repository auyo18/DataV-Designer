export interface DragWidgetTypes {
  id: number
  position: { width: number; height: number; left: number; top: number }
  color?: string
  background?: string
  children?: DragWidgetTypes[]
}
