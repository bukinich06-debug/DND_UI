import type { EquipSlot } from "../types";
import { getItemsApiEnv, readApiError } from "./env";

interface IEquipItemParams {
  itemId: string;
  slot: EquipSlot;
}

export const equipItem = async ({ itemId, slot }: IEquipItemParams) => {
  const { baseUrl } = getItemsApiEnv();
  const url = new URL("/api/items/equip", baseUrl);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, slot }),
  });
  if (!res.ok) throw new Error(await readApiError(res, "Не удалось надеть предмет."));
};
