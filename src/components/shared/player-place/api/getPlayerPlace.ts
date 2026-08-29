interface IPlayerPlace {
  location: { name: string; summary: string } | null;
}

interface IGetPlayerPlaceParams {
  signal?: AbortSignal;
}

export const getPlayerPlace = async ({ signal }: IGetPlayerPlaceParams = {}): Promise<IPlayerPlace> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID;

  if (!baseUrl || !playerId) throw new Error("Не заданы переменные окружения для запроса локации игрока.");

  const url = new URL("/api/location/player", baseUrl);
  url.searchParams.set("playerId", playerId);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Не удалось получить текущую локацию игрока.");

  return (await res.json()) as IPlayerPlace;
};
