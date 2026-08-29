import { mapItem } from "../helpers/mapItem";
import type { IApiItem } from "../types";
import type { IInventoryItem } from "@/components/shared/types";
import { getItemsApiEnv } from "./env";

interface IGetItemsParams {
  signal?: AbortSignal;
}

export const getItems = async ({ signal }: IGetItemsParams = {}): Promise<IInventoryItem[]> => {
  const { baseUrl, playerId } = getItemsApiEnv();

  const url = new URL("/api/items", baseUrl);
  url.searchParams.set("playerId", playerId);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Не удалось получить предметы игрока.");

  const data = (await res.json()) as IApiItem[];
  if (!Array.isArray(data)) throw new Error("Некорректный ответ списка предметов.");

  return data.map(mapItem);
};
