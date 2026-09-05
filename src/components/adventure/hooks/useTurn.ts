import { useEffect, useRef, useState } from "react";
import type { ILogEntry, ITurnReply } from "@/components/shared/types";
import { useRefreshPurse } from "@/components/shared/purse";
import { getPlayerPlace } from "@/components/shared/player-place";
import { postTurn, type IChatMessage } from "../composer/api/postTurn";
import { npcChatText } from "../composer/helpers/npcChatText";

const withId = (reply: ITurnReply): ILogEntry => ({ ...reply, id: crypto.randomUUID() });

interface IParams {
  onLocationChanged: () => void;
}

const placeId = (data: Awaited<ReturnType<typeof getPlayerPlace>>) => data.location?.id ?? null;

export const useTurn = ({ onLocationChanged }: IParams) => {
  const refreshPurse = useRefreshPurse();
  const locationIdRef = useRef<string | null>(null);
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getPlayerPlace({ signal: controller.signal })
      .then((data) => {
        locationIdRef.current = placeId(data);
      })
      .catch(() => {
        /* seed optional */
      });
    return () => controller.abort();
  }, []);

  const syncPlace = async () => {
    try {
      const data = await getPlayerPlace();
      const nextId = placeId(data);
      if (nextId !== locationIdRef.current) {
        locationIdRef.current = nextId;
        onLocationChanged();
      }
    } catch {
      /* ход уже показан — ошибка места не валит UI */
    }
  };

  const send = async (text: string) => {
    const player: ILogEntry = { id: crypto.randomUUID(), agent: "player", do: text, say: null };
    const next: IChatMessage[] = [...messages, { role: "user", content: text }];
    setEntries((prev) => [...prev, player]);
    setSending(true);
    setError(null);
    try {
      const replies = await postTurn({ messages: next });
      const npcText = npcChatText(replies);
      setMessages(npcText ? [...next, { role: "assistant", content: npcText }] : next);
      setEntries((prev) => [...prev, ...replies.map(withId)]);
      await refreshPurse();
      await syncPlace();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить ход.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { entries, send, sending, error };
};
