import type { TabId } from "@/components/shared/types";

export interface ICharacterPanelProps {
  onInventory: () => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}
