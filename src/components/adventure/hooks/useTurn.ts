import { useEffect, useRef, useState } from "react";
import type { ICheckEntry, ILogEntry, ITurnReply } from "@/components/shared/types";
import { useRefreshPurse } from "@/components/shared/purse";
import { getPlayerPlace } from "@/components/shared/player-place";
import { postDiceRoll } from "../composer/api/postDiceRoll";
import {
  postTurn,
  type IChatMessage,
  type IResolvedCheck,
  type ITurnResult,
  type ITurnResume,
} from "../composer/api/postTurn";
import { assistantChatText } from "../composer/helpers/assistantChatText";

const withId = (reply: ITurnReply): ILogEntry => ({ ...reply, id: crypto.randomUUID() });

interface IPendingCheck {
  check: IResolvedCheck;
  resume: ITurnResume;
  messages: IChatMessage[];
  entryId: string;
}

interface IParams {
  onLocationChanged: () => void;
}

const placeId = (data: Awaited<ReturnType<typeof getPlayerPlace>>) => data.location?.id ?? null;

const toCheckEntry = (id: string, check: IResolvedCheck): ICheckEntry => ({
  id,
  agent: "check",
  skillLabel: check.skillLabel,
  dc: check.dc,
  bonus: check.bonus,
  die: check.die,
});

const withRoll = (entry: ICheckEntry, d20: number): ICheckEntry => {
  const total = d20 + entry.bonus;
  return { ...entry, d20, total, passed: total >= entry.dc };
};

const appendAssistant = (chat: IChatMessage[], replies: ITurnReply[]): IChatMessage[] => {
  const assistantText = assistantChatText(replies);
  if (!assistantText) return chat;
  return [...chat, { role: "assistant", content: assistantText }];
};

export const useTurn = ({ onLocationChanged }: IParams) => {
  const refreshPurse = useRefreshPurse();
  const locationIdRef = useRef<string | null>(null);
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [pending, setPending] = useState<IPendingCheck | null>(null);
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

  const applyReplies = (result: ITurnResult, resumeChat: IChatMessage[]) => {
    const extra: ILogEntry[] = result.replies.map(withId);
    if (result.status === "need_check") {
      const entryId = crypto.randomUUID();
      extra.push(toCheckEntry(entryId, result.check));
      setPending({ check: result.check, resume: result.resume, messages: resumeChat, entryId });
    } else {
      setPending(null);
    }
    setEntries((prev) => [...prev, ...extra]);
  };

  const send = async (text: string) => {
    if (pending) return;
    const player: ILogEntry = { id: crypto.randomUUID(), agent: "player", do: text, say: null };
    const next: IChatMessage[] = [...messages, { role: "user", content: text }];
    setEntries((prev) => [...prev, player]);
    setSending(true);
    setError(null);
    try {
      const result = await postTurn({ messages: next });
      setMessages(appendAssistant(next, result.replies));
      applyReplies(result, next);
      await refreshPurse();
      await syncPlace();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить ход.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  const rollCheck = async () => {
    if (!pending || sending) return;
    setSending(true);
    setError(null);
    const current = pending;
    try {
      const roll = await postDiceRoll(current.check.skill);
      const result = await postTurn({
        messages: current.messages,
        resume: current.resume,
        check: {
          skill: current.check.skill,
          dc: current.check.dc,
          knowledgeId: current.check.knowledgeId,
        },
        rollId: roll.id,
      });
      setEntries((prev) =>
        prev.map((entry) => {
          if (entry.id !== current.entryId || entry.agent !== "check") return entry;
          return withRoll(entry, roll.value);
        }),
      );
      setMessages((prev) => appendAssistant(prev, result.replies));
      applyReplies(result, current.messages);
      await refreshPurse();
      await syncPlace();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить проверку.");
    } finally {
      setSending(false);
    }
  };

  return {
    entries,
    send,
    rollCheck,
    sending,
    locked: sending || Boolean(pending),
    error,
  };
};
