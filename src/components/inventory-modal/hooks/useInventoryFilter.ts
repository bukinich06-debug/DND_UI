import { useEffect, useState } from "react"
import type { CategoryFilter, IInventoryItem } from "@/components/shared/types"

export const useInventoryFilter = (items: IInventoryItem[]) => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [selected, setSelected] = useState<IInventoryItem | null>(null)

  useEffect(() => {
    setSelected((prev) => {
      if (prev) {
        const next = items.find((item) => item.id === prev.id)
        if (next) return next
      }
      return items[0] ?? null
    })
  }, [items])

  const filtered = items.filter((item) => {
    const matchCat = category === "all" || item.category === category
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalWeight = items.reduce((sum, i) => sum + i.weight * i.qty, 0)

  return {
    search,
    setSearch,
    category,
    setCategory,
    selected,
    setSelected,
    filtered,
    totalWeight,
  }
}
