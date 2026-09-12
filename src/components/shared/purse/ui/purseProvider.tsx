"use client"

import type { ReactNode } from "react"
import { PurseContextProvider, usePurseState } from "../hooks/usePurseState"

interface IPurseProviderProps {
  children: ReactNode
}

export const PurseProvider = ({ children }: IPurseProviderProps) => {
  const value = usePurseState()
  return <PurseContextProvider value={value}>{children}</PurseContextProvider>
}
