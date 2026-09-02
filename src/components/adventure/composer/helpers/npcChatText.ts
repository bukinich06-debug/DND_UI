import type { INpcReply, ITurnReply } from "@/components/shared/types";

const npcLine = (reply: INpcReply) => {
  const parts: string[] = [];
  if (reply.do?.trim()) parts.push(reply.do.trim());
  if (reply.say?.trim()) parts.push(`«${reply.say.trim()}»`);
  if (parts.length === 0) return null;
  return `${reply.npcName}: ${parts.join(" ")}`;
};

export const npcChatText = (replies: ITurnReply[]): string | null => {
  const lines = replies
    .filter((reply): reply is INpcReply => reply.agent === "npc")
    .map(npcLine)
    .filter((line): line is string => Boolean(line));
  if (lines.length === 0) return null;
  return lines.join("\n");
};
