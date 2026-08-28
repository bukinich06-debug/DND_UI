import type { INpcAtLocation } from "../types";

interface IGetNpcsParams {
  signal?: AbortSignal;
}

export const getNpcs = async ({ signal }: IGetNpcsParams = {}): Promise<INpcAtLocation[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID;

  if (!baseUrl || !playerId) throw new Error("Не заданы переменные окружения для запроса NPC.");

  const url = new URL("/api/location/player/npcs", baseUrl);
  url.searchParams.set("playerId", playerId);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Не удалось получить NPC рядом с игроком.");

  const data = (await res.json()) as INpcAtLocation[];
  if (!Array.isArray(data)) throw new Error("Некорректный ответ списка NPC.");

  return data;
};
