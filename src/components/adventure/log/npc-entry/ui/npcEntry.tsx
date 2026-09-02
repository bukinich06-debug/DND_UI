import type { INpcReply } from "@/components/shared/types";

interface INpcEntryProps {
  entry: INpcReply;
}

export const NpcEntry = ({ entry }: INpcEntryProps) => {
  if (!entry.do && !entry.say) return null;

  return (
    <div className="mb-5 border-l-2 border-accent pl-3.5">
      <div className="mb-1 font-sans text-[13px] tracking-wide text-foreground">{entry.npcName}</div>
      {entry.do && <p className="m-0 font-sans text-[15px] leading-[1.5] text-narration">{entry.do}</p>}
      {entry.say && (
        <p className={`m-0 font-sans text-[15px] leading-[1.5] text-npc italic ${entry.do ? "mt-1.5" : ""}`}>
          &ldquo;{entry.say}&rdquo;
        </p>
      )}
    </div>
  );
};
