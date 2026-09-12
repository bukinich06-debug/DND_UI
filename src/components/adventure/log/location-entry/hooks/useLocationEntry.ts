import { useState } from "react"

export const useLocationEntry = () => {
  const [open, setOpen] = useState(true)
  const toggle = () => setOpen((prev) => !prev)
  return { open, toggle }
}
