import { useCallback, useEffect, useRef } from 'react'

const useDebounce = (fn: Function, time: number = 500) => {
  const timer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  return useCallback(
    function (...args) {
      const bind = this
      return new Promise((resolve, reject) => {
        timer.current && clearTimeout(timer.current)

        // 异步访问事件属性
        args?.[0]?.persist?.()

        timer.current = setTimeout(() => {
          fn.call(bind, ...args)
            ?.then?.((res: any) => {
              resolve(res)
            })
            .catch((e: any) => {
              reject(e)
            })
        }, time)
      })
    },
    [fn, time],
  )
}

export default useDebounce
