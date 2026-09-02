"use client";

import type { ILogEntry } from "@/components/shared/types";
import { LocationEntry } from "../../location-entry";
import { NpcEntry } from "../../npc-entry";
import { MasterEntry } from "../../master-entry";
import { PlayerEntry } from "../../player-entry";
import { CheckEntry } from "../../check-entry";

interface ILogEntryProps {
  entry: ILogEntry;
}

export const LogEntry = ({ entry }: ILogEntryProps) => {
  if (entry.agent === "location") return <LocationEntry entry={entry} />;
  if (entry.agent === "npc") return <NpcEntry entry={entry} />;
  if (entry.agent === "master") return <MasterEntry />;
  if (entry.agent === "player") return <PlayerEntry entry={entry} />;
  if (entry.agent === "check") return <CheckEntry entry={entry} />;
  return null;
};
