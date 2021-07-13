import { useSelector as reduxUseSelector } from 'react-redux'
import { StoreType } from '@/types'

export default function useSelector<TState = StoreType, TSelected = unknown>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected {
  return reduxUseSelector(selector, equalityFn)
}
