import { useState } from "react";
import type { TabId } from "@/components/shared/types";

export const useShell = () => {
  const [rightOpen, setRightOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("character");

  return { rightOpen, setRightOpen, inventoryOpen, setInventoryOpen, activeTab, setActiveTab };
};
