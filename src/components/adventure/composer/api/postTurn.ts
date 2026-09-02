import type { ITurnReply } from "@/components/shared/types";
import { getTurnApiEnv, readApiError } from "./env";

interface IPostTurnParams {
  content: string;
}

export const postTurn = async ({ content }: IPostTurnParams): Promise<ITurnReply[]> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv();
  const url = new URL("/api/turn", baseUrl);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId,
      playerId,
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(await readApiError(res, "Не удалось выполнить ход."));
  return (await res.json()) as ITurnReply[];
};
