import { getItemsApiEnv, readApiError } from "./env";

interface IUnequipItemParams {
  itemId: string;
}

export const unequipItem = async ({ itemId }: IUnequipItemParams) => {
  const { baseUrl } = getItemsApiEnv();
  const url = new URL("/api/items/unequip", baseUrl);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId }),
  });
  if (!res.ok) throw new Error(await readApiError(res, "Не удалось снять предмет."));
};
