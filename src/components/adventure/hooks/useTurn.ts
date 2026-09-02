import { useState } from "react";
import type { ILogEntry, ITurnReply } from "@/components/shared/types";
import { postTurn } from "../composer/api/postTurn";

const withId = (reply: ITurnReply): ILogEntry => ({ ...reply, id: crypto.randomUUID() });

export const useTurn = () => {
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (text: string) => {
    const player: ILogEntry = { id: crypto.randomUUID(), agent: "player", do: text, say: null };
    setEntries((prev) => [...prev, player]);
    setSending(true);
    setError(null);
    try {
      const replies = await postTurn({ content: text });
      setEntries((prev) => [...prev, ...replies.map(withId)]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить ход.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { entries, send, sending, error };
};
