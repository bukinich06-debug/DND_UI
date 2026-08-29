"use client";

import { Adventure } from "@/components/adventure";
import { CharacterPanel } from "@/components/character-panel";
import { InventoryModal } from "@/components/inventory-modal";
import { SituationPanel } from "@/components/situation-panel";
import { IconChevronLeft } from "@/components/shared/icon";
import { useShell } from "../hooks/useShell";

export const AppLayout = () => {
  const {
    rightOpen,
    setRightOpen,
    inventoryOpen,
    setInventoryOpen,
    activeTab,
    setActiveTab,
    locationEpoch,
    bumpLocation,
  } = useShell();

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-background">
      <CharacterPanel onInventory={() => setInventoryOpen(true)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Adventure onLocationChanged={bumpLocation} locationEpoch={locationEpoch} />

      {!rightOpen && (
        <button
          type="button"
          onClick={() => setRightOpen(true)}
          className="absolute top-3.5 right-0 z-10 flex size-7 cursor-pointer items-center justify-center border border-border bg-panel text-muted"
        >
          <IconChevronLeft />
        </button>
      )}

      <SituationPanel
        open={rightOpen}
        onToggle={() => setRightOpen((o) => !o)}
        locationEpoch={locationEpoch}
      />

      {inventoryOpen && <InventoryModal onClose={() => setInventoryOpen(false)} />}
    </div>
  );
};
