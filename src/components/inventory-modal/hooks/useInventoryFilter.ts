import { useMessages } from "next-intl";
import { useState } from "react";
import type { CategoryFilter, IContent, IInventoryItem } from "@/components/shared/types";

export const useInventoryFilter = () => {
  const messages = useMessages();
  const items = (messages.content as IContent).items;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selected, setSelected] = useState<IInventoryItem | null>(items[0] ?? null);

  const filtered = items.filter((item) => {
    const matchCat = category === "all" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalWeight = items.reduce((sum, i) => sum + i.weight * i.qty, 0);

  return { items, search, setSearch, category, setCategory, selected, setSelected, filtered, totalWeight };
};
