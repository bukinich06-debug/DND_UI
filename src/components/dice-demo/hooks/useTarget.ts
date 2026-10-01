import { useState } from "react"

export const useTarget = () => {
  const [target, setTarget] = useState<number | null>(null)

  const pick = (value: string) => setTarget(value ? Number(value) : null)

  return { target, pick }
}
