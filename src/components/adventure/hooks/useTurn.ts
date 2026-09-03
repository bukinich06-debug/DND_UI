import { useState } from "react";
import type { ILogEntry, ITurnReply } from "@/components/shared/types";
import { useRefreshPurse } from "@/components/shared/purse";
import { postTurn, type IChatMessage } from "../composer/api/postTurn";
import { npcChatText } from "../composer/helpers/npcChatText";

const withId = (reply: ITurnReply): ILogEntry => ({ ...reply, id: crypto.randomUUID() });

export const useTurn = () => {
  const refreshPurse = useRefreshPurse();
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить ход.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { entries, send, sending, error };
};
