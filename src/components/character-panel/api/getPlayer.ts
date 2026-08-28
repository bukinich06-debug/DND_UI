import type { IPlayer } from "../types";

interface IGetPlayerParams {
  signal?: AbortSignal;
}

export const getPlayer = async ({ signal }: IGetPlayerParams = {}): Promise<IPlayer> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID;

  if (!baseUrl || !playerId) throw new Error("Не заданы переменные окружения для запроса игрока.");

  const url = new URL(`/api/players/${playerId}`, baseUrl);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Не удалось получить данные игрока.");

  const data = (await res.json()) as IPlayer;
  if (!data.id) throw new Error("Некорректный ответ данных игрока.");

  return data;
};
