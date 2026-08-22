import type { IInventoryItem } from "@/components/shared/types";
import { ActionBtn } from "@/components/shared/action-btn";
import { ItemIcon } from "../../helpers/itemIcon";
import { useTranslations } from "next-intl";

const RARITY_COLORS: Record<string, string> = {
  common: "#7a7060",
  uncommon: "#6b9e8a",
  rare: "#9a6bc4",
};

interface IItemDetailProps {
  item: IInventoryItem;
  unit: string;
}

export const ItemDetail = ({ item, unit }: IItemDetailProps) => {
  const t = useTranslations("inventory");

  return (
    <div className="scrollable w-[280px] shrink-0 overflow-y-auto p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-gold">
          <ItemIcon category={item.category} />
        </span>
        <h3 className="m-0 font-serif text-xl font-medium text-foreground">{item.name}</h3>
      </div>
      <div className="mb-3.5 font-sans text-xs text-muted">
        {t(`categories.${item.category}`)}
        {item.rarity && item.rarity !== "common" && (
          <span className="ml-2" style={{ color: RARITY_COLORS[item.rarity] }}>
            {t(`rarity.${item.rarity}`)}
          </span>
        )}
      </div>
      <p className="mb-4 font-serif text-[15px] leading-[1.6] text-foreground-dim italic">&ldquo;{item.description}&rdquo;</p>
      {item.properties && (
        <div className="mb-4">
          <div className="mb-1.5 text-[10px] uppercase tracking-widest text-muted">{t("properties")}</div>
          {item.properties.map((p) => (
            <div key={p} className="border-b border-[#1f1c18] py-[3px] font-sans text-xs text-foreground-dim">
              {p}
            </div>
          ))}
        </div>
      )}
      <div className="mb-3 flex gap-2">
        <div className="flex-1 rounded border border-border bg-panel-alt p-2 text-center">
          <div className="text-[9px] uppercase tracking-widest text-muted">{t("weight")}</div>
          <div className="font-mono text-sm text-foreground">
            {item.weight} {unit}
          </div>
        </div>
        <div className="flex-1 rounded border border-border bg-panel-alt p-2 text-center">
          <div className="text-[9px] uppercase tracking-widest text-muted">{t("value")}</div>
          <div className="font-mono text-sm text-foreground">{item.value}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.equipped && <ActionBtn label={t("actions.unequip")} />}
        {!item.equipped && (item.category === "weapons" || item.category === "armor") && (
          <ActionBtn label={t("actions.equip")} primary />
        )}
        {item.category === "consumables" && <ActionBtn label={t("actions.use")} primary />}
        <ActionBtn label={t("actions.inspect")} />
        {item.category !== "quest" && <ActionBtn label={t("actions.drop")} danger />}
      </div>
    </div>
  );
};
