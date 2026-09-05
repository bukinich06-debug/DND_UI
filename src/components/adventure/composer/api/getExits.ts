import type { IComposerExit } from "../types";
import { getTurnApiEnv, readApiError } from "./env";

interface ILocation {
  id: string;
  name: string;
  parentId: string | null;
}

interface IPlayerLocation {
  location: { id: string } | null;
}

interface IParams {
  signal?: AbortSignal;
}

export const getExits = async ({ signal }: IParams = {}): Promise<IComposerExit[]> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv();

  const placeUrl = new URL("/api/location/player", baseUrl);
  placeUrl.searchParams.set("playerId", playerId);

  const locsUrl = new URL("/api/location", baseUrl);
  locsUrl.searchParams.set("campaignId", campaignId);

  const [placeRes, locsRes] = await Promise.all([
    fetch(placeUrl, { signal }),
    fetch(locsUrl, { signal }),
  ]);

  if (!placeRes.ok) throw new Error(await readApiError(placeRes, "Не удалось загрузить позицию игрока."));
  if (!locsRes.ok) throw new Error(await readApiError(locsRes, "Не удалось загрузить локации."));

  const place = (await placeRes.json()) as IPlayerLocation;
  const locs = (await locsRes.json()) as ILocation[];

  const hereId = place.location?.id;
  if (!hereId) return [];

  const here = locs.find((loc) => loc.id === hereId);
  if (!here) return [];

  const exits: IComposerExit[] = [];

  if (here.parentId) {
    const parent = locs.find((loc) => loc.id === here.parentId);
    if (parent) exits.push({ id: parent.id, name: parent.name, kind: "parent" });
  }

  for (const loc of locs) {
    if (loc.parentId === hereId) exits.push({ id: loc.id, name: loc.name, kind: "child" });
  }

  return exits;
};
