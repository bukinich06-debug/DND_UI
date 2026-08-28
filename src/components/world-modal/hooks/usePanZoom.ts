import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"

const MIN = 0.45
const MAX = 1.6

interface IDrag {
  x: number
  y: number
  px: number
  py: number
}

export const usePanZoom = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [scale, setScale] = useState(1)
  const drag = useRef<IDrag | null>(null)

  const onWheel = (e: ReactWheelEvent) => {
    e.preventDefault()
    const next = Math.min(
      MAX,
      Math.max(MIN, scale + (e.deltaY > 0 ? -0.08 : 0.08)),
    )
    setScale(next)
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return
    drag.current = { x, y, px: e.clientX, py: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return
    setX(drag.current.x + (e.clientX - drag.current.px))
    setY(drag.current.y + (e.clientY - drag.current.py))
  }

  const onPointerUp = () => {
    drag.current = null
  }

  return { x, y, scale, onWheel, onPointerDown, onPointerMove, onPointerUp }
}
