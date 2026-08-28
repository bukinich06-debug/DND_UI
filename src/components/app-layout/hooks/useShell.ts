import { useState } from "react";
import type { TabId } from "@/components/shared/types";

export const useShell = () => {
  const [rightOpen, setRightOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("character");
  const [locationEpoch, setLocationEpoch] = useState(0);

  const bumpLocation = () => setLocationEpoch((n) => n + 1);

  return {
    rightOpen,
    setRightOpen,
    inventoryOpen,
    setInventoryOpen,
    activeTab,
    setActiveTab,
    locationEpoch,
    bumpLocation,
  };
};
