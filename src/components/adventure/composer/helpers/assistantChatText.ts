import type { IMasterReply, INpcReply, ITurnReply } from "@/components/shared/types";

const npcLine = (reply: INpcReply) => {
  const parts: string[] = [];
  if (reply.do?.trim()) parts.push(reply.do.trim());
  if (reply.say?.trim()) parts.push(`«${reply.say.trim()}»`);
  if (parts.length === 0) return null;
  return `${reply.npcName}: ${parts.join(" ")}`;
};

const masterLine = (reply: IMasterReply) => {
  const say = reply.say.trim();
  if (!say) return null;
  return `Мастер: ${say}`;
};

export const assistantChatText = (replies: ITurnReply[]): string | null => {
  const lines: string[] = [];
  for (const reply of replies) {
    if (reply.agent === "npc") {
      const line = npcLine(reply);
      if (line) lines.push(line);
    }
    if (reply.agent === "master") {
      const line = masterLine(reply);
      if (line) lines.push(line);
    }
  }
  if (lines.length === 0) return null;
  return lines.join("\n");
};
