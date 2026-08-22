"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type MessageType = "narration" | "npc" | "player" | "system" | "combat";

interface Message {
  id: number;
  type: MessageType;
  text: string;
  speaker?: string;
  roll?: string;
  timestamp?: string;
}

interface InventoryItem {
  id: number;
  name: string;
  category: "weapons" | "armor" | "consumables" | "quest" | "other";
  qty: number;
  description: string;
  weight: number;
  rarity?: "common" | "uncommon" | "rare";
  equipped?: boolean;
  value?: string;
  properties?: string[];
}

// ─── Static data ─────────────────────────────────────────────────────────────

const ADVENTURE_LOG: Message[] = [
  {
    id: 1,
    type: "narration",
    text: "The rain lashes against the shuttered windows of the Rusty Lantern. You push open the heavy oak door and step inside. Warm firelight fills the low-ceilinged common room, but conversation dies the moment you cross the threshold. A dozen pairs of eyes find you — then look away.",
    timestamp: "Evening",
  },
  {
    id: 2,
    type: "npc",
    speaker: "Gareth (Bartender)",
    text: "You're not from around here, are you? Last stranger who wandered in asking questions... well. What'll it be?",
  },
  {
    id: 3,
    type: "player",
    text: 'You set two silver coins on the bar and lean in. "I\'m looking for the Harwick caravan — three wagons, left Millhaven six days ago. Never arrived at Thorngate. I\'m told you might know something."',
  },
  {
    id: 4,
    type: "system",
    text: "Persuasion Check",
    roll: "14 + 2 = 16",
    speaker: "Success",
  },
  {
    id: 5,
    type: "narration",
    text: "Gareth's jaw tightens. He wipes the bar slowly with a rag that was never going to clean anything. Then, without looking at you, he tips his head toward the back corner — where a cloaked figure nurses a drink alone.",
    timestamp: "Evening",
  },
  {
    id: 6,
    type: "combat",
    text: "A chair scrapes behind you. Two figures rise from a corner table — heavyset men, hands moving toward belt knives. One of them snarls: \"Harwick's business stays Harwick's business, ranger.\"",
    speaker: "Ambush — Roll for Initiative",
  },
];

const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: "Longbow",
    category: "weapons",
    qty: 1,
    description: "A finely crafted recurve bow of yew wood. Reliable at range.",
    weight: 2,
    rarity: "common",
    equipped: true,
    value: "25 gp",
    properties: ["Range 150/600 ft", "1d8 piercing", "Two-handed"],
  },
  {
    id: 2,
    name: "Leather Armor",
    category: "armor",
    qty: 1,
    description: "Supple leather armor reinforced at the shoulders and chest.",
    weight: 10,
    rarity: "common",
    equipped: true,
    value: "10 gp",
    properties: ["AC 11 + DEX modifier", "No disadvantage on Stealth"],
  },
  {
    id: 3,
    name: "Quiver of Arrows",
    category: "weapons",
    qty: 20,
    description: "Standard iron-tipped arrows. Well-fletched.",
    weight: 1,
    rarity: "common",
    value: "1 gp",
    properties: ["1d6 piercing with shortbow", "1d8 piercing with longbow"],
  },
  {
    id: 4,
    name: "Healing Potion",
    category: "consumables",
    qty: 3,
    description: "A small vial of glowing red liquid. Restores 2d4 + 2 hit points.",
    weight: 0.5,
    rarity: "common",
    value: "50 gp",
    properties: ["Restores 2d4 + 2 HP", "Bonus action to use"],
  },
  {
    id: 5,
    name: "Hempen Rope",
    category: "other",
    qty: 1,
    description: "Fifty feet of sturdy rope. Can support up to 300 pounds.",
    weight: 10,
    rarity: "common",
    value: "1 gp",
    properties: ["50 feet", "300 lb capacity"],
  },
  {
    id: 6,
    name: "Letter of Introduction",
    category: "quest",
    qty: 1,
    description: "A sealed letter from Merchant Harwick bearing his personal crest. Opens doors.",
    weight: 0,
    rarity: "uncommon",
    value: "—",
    properties: ["Quest item", "Cannot be dropped"],
  },
  {
    id: 7,
    name: "Shortsword",
    category: "weapons",
    qty: 1,
    description: "A plain iron shortsword. Good for close quarters.",
    weight: 2,
    rarity: "common",
    value: "10 gp",
    properties: ["1d6 piercing", "Finesse, Light"],
  },
];

const NEARBY = [
  { icon: "👤", label: "Gareth", sub: "Bartender — wary but cooperative" },
  { icon: "🧥", label: "Mira", sub: "Cloaked traveler — unknown motive" },
  { icon: "⚠️", label: "Two armed men", sub: "Hostile — watching you" },
  { icon: "📌", label: "Notice Board", sub: "Near the entrance" },
  { icon: "🚪", label: "Back Door", sub: "Leads to the alley" },
  { icon: "🍺", label: "Bar", sub: "Gareth tends it" },
];

const ACTION_SUGGESTIONS = ["Talk", "Inspect", "Search", "Attack", "Move", "Rest", "Stealth"];

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconSword = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
  </svg>
);

const IconHeart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconDice = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 8h.01M12 12h.01M8 16h.01M8 8h.01M16 16h.01" />
  </svg>
);

const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const IconBook = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconSettings = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconUser = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function AbilityCard({ name, score }: { name: string; score: number }) {
  const mod = Math.floor((score - 10) / 2);
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
  return (
    <div
      style={{ backgroundColor: "#1a1917", borderColor: "#2e2b27" }}
      className="border rounded flex flex-col items-center py-1.5 gap-0.5"
    >
      <span style={{ color: "#7a7060", fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.08em" }} className="uppercase font-medium">
        {name}
      </span>
      <span style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 500, lineHeight: 1 }}>
        {score}
      </span>
      <span style={{ color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
        {modStr}
      </span>
    </div>
  );
}

function BarStat({
  label, current, max, color, icon,
}: {
  label: string; current: number; max: number; color: string; icon?: React.ReactNode;
}) {
  const pct = Math.min(100, (current / max) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span style={{ color: "#7a7060", fontSize: "11px", fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-1 uppercase tracking-wider">
          {icon && <span style={{ color }}>{icon}</span>}
          {label}
        </span>
        <span style={{ color: "#b0a898", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
          {current}<span style={{ color: "#7a7060" }}>/{max}</span>
        </span>
      </div>
      <div style={{ backgroundColor: "#2e2b27", height: "5px", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, backgroundColor: color, height: "100%", borderRadius: "2px", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function LeftSidebar({ onInventory, activeTab, setActiveTab }: {
  onInventory: () => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}) {
  const tabs = ["Character", "Spells", "Journal"];

  return (
    <aside
      style={{ backgroundColor: "#0f0e0d", borderColor: "#2e2b27", width: "280px", flexShrink: 0 }}
      className="border-r flex flex-col h-full"
    >
      {/* Character header */}
      <div style={{ borderColor: "#2e2b27", padding: "20px 16px 16px" }} className="border-b">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 52, height: 52, borderRadius: "50%",
              backgroundColor: "#231f1a", border: "1.5px solid #3d3830",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#7a7060", flexShrink: 0,
            }}
          >
            <IconUser />
          </div>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#e8e0d0", lineHeight: 1.1, fontWeight: 500 }}>
              Aldric
            </span>
            <span style={{ color: "#c9a84c", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>
              Ranger · Level 3
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map(i => (
                <span key={i} style={{ color: "#c9a84c" }}><IconStar /></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "14px 16px", borderColor: "#2e2b27" }} className="border-b flex flex-col gap-3">
        <BarStat label="HP" current={24} max={28} color="#7ab87a" icon={<IconHeart />} />
        <BarStat label="XP" current={640} max={900} color="#5a7fc9" />

        <div className="flex gap-3 mt-1">
          <div style={{ flex: 1, backgroundColor: "#1a1917", border: "1px solid #2e2b27", borderRadius: "4px", padding: "8px", textAlign: "center" }}>
            <div style={{ color: "#7a7060", fontSize: "9px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" }} className="uppercase">AC</div>
            <div style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "18px", fontWeight: 500 }}>15</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#1a1917", border: "1px solid #2e2b27", borderRadius: "4px", padding: "8px", textAlign: "center" }}>
            <div style={{ color: "#7a7060", fontSize: "9px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" }} className="uppercase">Prof</div>
            <div style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "18px", fontWeight: 500 }}>+2</div>
          </div>
          <div style={{ flex: 1, backgroundColor: "#1a1917", border: "1px solid #2e2b27", borderRadius: "4px", padding: "8px", textAlign: "center" }}>
            <div style={{ color: "#7a7060", fontSize: "9px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" }} className="uppercase">Init</div>
            <div style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "18px", fontWeight: 500 }}>+3</div>
          </div>
        </div>
      </div>

      {/* Ability scores */}
      <div style={{ padding: "14px 16px", borderColor: "#2e2b27" }} className="border-b">
        <div style={{ color: "#7a7060", fontSize: "10px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", marginBottom: "8px" }} className="uppercase">
          Ability Scores
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
          {[
            { name: "STR", score: 12 }, { name: "DEX", score: 17 }, { name: "CON", score: 13 },
            { name: "INT", score: 11 }, { name: "WIS", score: 14 }, { name: "CHA", score: 9 },
          ].map(a => <AbilityCard key={a.name} {...a} />)}
        </div>
      </div>

      {/* Equipment */}
      <div style={{ padding: "14px 16px", borderColor: "#2e2b27" }} className="border-b flex flex-col gap-2">
        <div style={{ color: "#7a7060", fontSize: "10px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", marginBottom: "2px" }} className="uppercase">
          Equipment
        </div>
        {[
          { icon: <IconSword />, label: "Longbow", sub: "Weapon · 1d8+3" },
          { icon: <IconShield />, label: "Leather Armor", sub: "AC 12 + DEX" },
        ].map(e => (
          <div key={e.label} className="flex items-center gap-2">
            <span style={{ color: "#c9a84c" }}>{e.icon}</span>
            <div>
              <div style={{ color: "#e8e0d0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>{e.label}</div>
              <div style={{ color: "#7a7060", fontSize: "11px" }}>{e.sub}</div>
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {["Quiver ×20", "Potion ×3", "Rope"].map(tag => (
            <span key={tag} style={{
              backgroundColor: "#231f1a", border: "1px solid #2e2b27", borderRadius: "3px",
              padding: "2px 8px", fontSize: "11px", color: "#7a7060", fontFamily: "'Inter', sans-serif",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div style={{ padding: "10px 16px", borderColor: "#2e2b27" }} className="border-b">
        <div style={{ color: "#7a7060", fontSize: "10px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", marginBottom: "6px" }} className="uppercase">
          Conditions
        </div>
        <div className="flex gap-2 flex-wrap">
          <span style={{
            backgroundColor: "#1e2a1e", border: "1px solid #3d6040", borderRadius: "3px",
            padding: "2px 8px", fontSize: "11px", color: "#7ab87a",
          }}>Focused</span>
          <span style={{
            backgroundColor: "#2a1e1a", border: "1px solid #60402e", borderRadius: "3px",
            padding: "2px 8px", fontSize: "11px", color: "#c48060",
          }}>Wet (rain)</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Nav buttons */}
      <div style={{ padding: "12px 16px", borderColor: "#2e2b27" }} className="border-t">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#231f1a" : "transparent",
                border: `1px solid ${activeTab === tab ? "#3d3830" : "#2e2b27"}`,
                borderRadius: "4px",
                color: activeTab === tab ? "#c9a84c" : "#7a7060",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "7px 0",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={onInventory}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #2e2b27",
              borderRadius: "4px",
              color: "#7a7060",
              fontSize: "12px",
              fontFamily: "'Inter', sans-serif",
              padding: "7px 0",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Inventory
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Adventure Log ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.type === "narration") {
    return (
      <div style={{ padding: "0 0 24px 0" }}>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "18px",
          lineHeight: 1.7,
          color: "#ddd5c4",
          margin: 0,
        }}>
          {msg.text}
        </p>
        {msg.timestamp && (
          <div style={{ marginTop: "6px", color: "#7a7060", fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>
            — {msg.timestamp}
          </div>
        )}
      </div>
    );
  }

  if (msg.type === "npc") {
    return (
      <div style={{
        borderLeft: "2px solid #8a7035",
        paddingLeft: "14px",
        marginBottom: "20px",
      }}>
        <div style={{ color: "#c9a84c", fontSize: "11px", fontFamily: "'Inter', sans-serif", marginBottom: "4px", letterSpacing: "0.04em" }}>
          {msg.speaker}
        </div>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "17px",
          lineHeight: 1.65,
          color: "#c4b89a",
          fontStyle: "italic",
          margin: 0,
        }}>
          "{msg.text}"
        </p>
      </div>
    );
  }

  if (msg.type === "player") {
    return (
      <div style={{
        backgroundColor: "#1a1917",
        border: "1px solid #2e2b27",
        borderRadius: "4px",
        padding: "12px 14px",
        marginBottom: "20px",
      }}>
        <div style={{ color: "#c9a84c", fontSize: "10px", fontFamily: "'Inter', sans-serif", marginBottom: "5px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Your action
        </div>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "16px",
          lineHeight: 1.6,
          color: "#e8e0d0",
          margin: 0,
        }}>
          {msg.text}
        </p>
      </div>
    );
  }

  if (msg.type === "system") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#1a2420",
        border: "1px solid #2e4038",
        borderRadius: "4px",
        padding: "8px 12px",
        marginBottom: "20px",
      }}>
        <span style={{ color: "#6b9e8a" }}><IconDice /></span>
        <div>
          <span style={{ color: "#6b9e8a", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 500 }}>
            {msg.text}
          </span>
          {msg.roll && (
            <span style={{ color: "#b0a898", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", marginLeft: "10px" }}>
              {msg.roll}
            </span>
          )}
          {msg.speaker && (
            <span style={{ color: "#7ab87a", fontFamily: "'Inter', sans-serif", fontSize: "11px", marginLeft: "10px", fontWeight: 500 }}>
              {msg.speaker}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (msg.type === "combat") {
    return (
      <div style={{
        borderLeft: "2px solid #c45c3a",
        backgroundColor: "#1f1510",
        padding: "12px 14px",
        marginBottom: "20px",
        borderRadius: "0 4px 4px 0",
      }}>
        <div className="flex items-center gap-1.5" style={{ marginBottom: "6px" }}>
          <span style={{ color: "#c45c3a" }}><IconSword /></span>
          <span style={{ color: "#c45c3a", fontSize: "11px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
            {msg.speaker}
          </span>
        </div>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "17px",
          lineHeight: 1.65,
          color: "#d4b483",
          margin: 0,
        }}>
          {msg.text}
        </p>
      </div>
    );
  }

  return null;
}

// ─── Center Panel ─────────────────────────────────────────────────────────────

function CenterPanel({ onInventory }: { onInventory: () => void }) {
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, []);

  const handleSuggestion = (s: string) => {
    setInput(prev => prev ? `${prev} ${s.toLowerCase()}` : s.toLowerCase());
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setInput("");
  };

  return (
    <main style={{ backgroundColor: "#0f0e0d", display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* Location header */}
      <header style={{
        borderBottom: "1px solid #2e2b27",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "22px", color: "#e8e0d0", fontWeight: 500, margin: 0, lineHeight: 1 }}>
              The Rusty Lantern
            </h1>
            <span style={{
              backgroundColor: "#1a2420", border: "1px solid #2e4038",
              borderRadius: "20px", padding: "2px 9px",
              fontSize: "11px", color: "#6b9e8a",
              fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#6b9e8a", display: "inline-block", animation: "pulse 2s infinite" }} />
              AI DM Active
            </span>
          </div>
          <p style={{ color: "#7a7060", fontSize: "13px", fontFamily: "'Inter', sans-serif", margin: "4px 0 0" }}>
            Evening · Rainy · Common room of a roadside tavern
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { icon: <IconBook />, label: "Journal" },
            { icon: <IconMap />, label: "World" },
            { icon: <IconSettings />, label: "Settings" },
          ].map(btn => (
            <button
              key={btn.label}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #2e2b27",
                borderRadius: "4px",
                color: "#7a7060",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "5px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#3d3830";
                (e.currentTarget as HTMLButtonElement).style.color = "#b0a898";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2e2b27";
                (e.currentTarget as HTMLButtonElement).style.color = "#7a7060";
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </header>

      {/* Adventure log */}
      <div
        ref={logRef}
        className="scrollable flex-1"
        style={{ padding: "32px 48px 16px", overflowY: "auto" }}
      >
        {ADVENTURE_LOG.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {/* Typing indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#c9a84c", opacity: 0.6 }} />
          <span style={{ color: "#7a7060", fontSize: "13px", fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}>
            The Dungeon Master weighs your next move...
          </span>
        </div>
      </div>

      {/* Action input */}
      <div style={{
        borderTop: "1px solid #2e2b27",
        padding: "16px 28px 20px",
        backgroundColor: "#0f0e0d",
        flexShrink: 0,
      }}>
        {/* Suggestion chips */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span style={{ color: "#7a7060", fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>Suggest:</span>
          {ACTION_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #2e2b27",
                borderRadius: "3px",
                color: "#7a7060",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "3px 9px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#8a7035";
                (e.currentTarget as HTMLButtonElement).style.color = "#c9a84c";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a1714";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2e2b27";
                (e.currentTarget as HTMLButtonElement).style.color = "#7a7060";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="What do you want to do?"
            rows={3}
            style={{
              flex: 1,
              backgroundColor: "#1a1917",
              border: "1px solid #3d3830",
              borderRadius: "4px",
              color: "#e8e0d0",
              fontFamily: "'EB Garamond', serif",
              fontSize: "17px",
              lineHeight: 1.5,
              padding: "12px 14px",
              resize: "none",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "#8a7035")}
            onBlur={e => (e.target.style.borderColor = "#3d3830")}
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: "#c9a84c",
              border: "none",
              borderRadius: "4px",
              color: "#0f0e0d",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              padding: "0 20px",
              height: "80px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              transition: "background-color 0.15s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#d4b483")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c9a84c")}
          >
            <IconSend />
            Execute
          </button>
        </div>
        <div style={{ color: "#3d3830", fontSize: "11px", fontFamily: "'Inter', sans-serif", marginTop: "6px" }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </main>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function RightSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <aside
      style={{
        width: open ? "300px" : "0",
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.3s ease",
        borderLeft: "1px solid #2e2b27",
        backgroundColor: "#0f0e0d",
        position: "relative",
      }}
    >
      {/* Toggle button — always visible */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          left: open ? "10px" : "-32px",
          top: "14px",
          width: 28,
          height: 28,
          backgroundColor: "#1a1917",
          border: "1px solid #2e2b27",
          borderRadius: "4px",
          color: "#7a7060",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "left 0.3s ease",
          flexShrink: 0,
        }}
      >
        {open ? <IconChevronRight /> : <IconChevronLeft />}
      </button>

      {open && (
        <div className="scrollable" style={{ height: "100%", overflowY: "auto", padding: "14px 0" }}>
          {/* Current situation */}
          <Section title="Situation">
            <div className="flex flex-col gap-1.5">
              {[
                { k: "Location", v: "The Rusty Lantern" },
                { k: "Time", v: "Evening, ~8th bell" },
                { k: "Weather", v: "Heavy rain" },
                { k: "Threat", v: "Two armed men — hostile" },
              ].map(r => (
                <div key={r.k} className="flex justify-between">
                  <span style={{ color: "#7a7060", fontSize: "12px", fontFamily: "'Inter', sans-serif" }}>{r.k}</span>
                  <span style={{ color: "#b0a898", fontSize: "12px", fontFamily: "'Inter', sans-serif", textAlign: "right", maxWidth: "60%" }}>{r.v}</span>
                </div>
              ))}
            </div>
          </Section>

          <SectionDivider />

          {/* Nearby */}
          <Section title="Nearby">
            <div className="flex flex-col gap-1">
              {NEARBY.map(n => (
                <button
                  key={n.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    borderRadius: "4px",
                    padding: "5px 6px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a1917";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2e2b27";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{n.icon}</span>
                  <div>
                    <div style={{ color: "#e8e0d0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>{n.label}</div>
                    <div style={{ color: "#7a7060", fontSize: "11px" }}>{n.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <SectionDivider />

          {/* Party */}
          <Section title="Party">
            <div style={{
              backgroundColor: "#1a1917",
              border: "1px solid #2e2b27",
              borderRadius: "4px",
              padding: "10px",
            }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div style={{ color: "#e8e0d0", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>Sylwen</div>
                  <div style={{ color: "#7a7060", fontSize: "11px" }}>Cleric · Lv 3</div>
                </div>
                <div style={{
                  backgroundColor: "#1e2a1e", border: "1px solid #3d6040", borderRadius: "3px",
                  padding: "2px 7px", fontSize: "11px", color: "#7ab87a",
                }}>Ready</div>
              </div>
              <BarStat label="HP" current={18} max={22} color="#7ab87a" />
            </div>
          </Section>

          <SectionDivider />

          {/* Quest */}
          <Section title="Active Quest">
            <div style={{
              backgroundColor: "#1a1917",
              border: "1px solid #2e2b27",
              borderRadius: "4px",
              padding: "10px",
            }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px", color: "#d4b483", marginBottom: "6px" }}>
                Find the Missing Caravan
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
                <div style={{ color: "#7a7060", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#c9a84c", display: "inline-block", flexShrink: 0 }} />
                  Learn what Gareth knows
                </div>
                <div style={{ color: "#7a7060", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2e2b27", display: "inline-block", flexShrink: 0 }} />
                  Speak to the cloaked traveler
                </div>
                <div style={{ color: "#7a7060", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2e2b27", display: "inline-block", flexShrink: 0 }} />
                  Locate the Harwick wagons
                </div>
              </div>
              <div style={{ height: "4px", backgroundColor: "#2e2b27", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "15%", height: "100%", backgroundColor: "#c9a84c", borderRadius: "2px" }} />
              </div>
              <div style={{ color: "#7a7060", fontSize: "10px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>1 of 3 objectives complete</div>
            </div>
          </Section>
        </div>
      )}
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ color: "#7a7060", fontSize: "10px", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em", marginBottom: "10px", textTransform: "uppercase" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: "1px", backgroundColor: "#2e2b27", margin: "0 16px" }} />;
}

// ─── Inventory Modal ──────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Weapons", "Armor", "Consumables", "Quest", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

const RARITY_COLORS: Record<string, string> = {
  common: "#7a7060",
  uncommon: "#6b9e8a",
  rare: "#9a6bc4",
};

function ItemIcon({ category }: { category: string }) {
  if (category === "weapons") return <IconSword />;
  if (category === "armor") return <IconShield />;
  if (category === "consumables") return <IconHeart />;
  return <IconStar />;
}

function InventoryModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [selected, setSelected] = useState<InventoryItem | null>(INVENTORY_ITEMS[0]);

  const filtered = INVENTORY_ITEMS.filter(item => {
    const matchCat = category === "All" || item.category === category.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalWeight = INVENTORY_ITEMS.reduce((sum, i) => sum + i.weight * i.qty, 0);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#1a1917",
        border: "1px solid #3d3830",
        borderRadius: "6px",
        width: "100%", maxWidth: "860px",
        height: "620px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2e2b27", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "22px", color: "#e8e0d0", margin: 0, fontWeight: 500 }}>Inventory</h2>
            <div style={{ color: "#7a7060", fontSize: "12px", marginTop: "2px" }}>
              Weight: <span style={{ color: "#b0a898", fontFamily: "'JetBrains Mono', monospace" }}>{totalWeight}</span>
              <span style={{ color: "#7a7060" }}> / 120 lb</span>
              <span style={{ display: "inline-block", margin: "0 8px", color: "#3d3830" }}>·</span>
              {INVENTORY_ITEMS.length} items
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#7a7060" }}>
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  backgroundColor: "#231f1a",
                  border: "1px solid #3d3830",
                  borderRadius: "4px",
                  color: "#e8e0d0",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  padding: "7px 12px 7px 32px",
                  outline: "none",
                  width: "180px",
                }}
              />
            </div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #2e2b27",
                borderRadius: "4px",
                color: "#7a7060",
                width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <IconX />
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #2e2b27", display: "flex", gap: "6px", flexShrink: 0 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                backgroundColor: category === cat ? "#231f1a" : "transparent",
                border: `1px solid ${category === cat ? "#8a7035" : "#2e2b27"}`,
                borderRadius: "3px",
                color: category === cat ? "#c9a84c" : "#7a7060",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "4px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Body: list + detail */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Item list */}
          <div className="scrollable" style={{ flex: 1, overflowY: "auto", borderRight: "1px solid #2e2b27" }}>
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "11px 20px",
                  backgroundColor: selected?.id === item.id ? "#231f1a" : "transparent",
                  border: "none",
                  borderBottom: "1px solid #1f1c18",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.1s",
                }}
                onMouseEnter={e => {
                  if (selected?.id !== item.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1f1c18";
                }}
                onMouseLeave={e => {
                  if (selected?.id !== item.id)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <span style={{ color: "#7a7060", flexShrink: 0 }}><ItemIcon category={item.category} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#e8e0d0", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>{item.name}</span>
                    {item.qty > 1 && (
                      <span style={{ color: "#7a7060", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>×{item.qty}</span>
                    )}
                    {item.equipped && (
                      <span style={{
                        backgroundColor: "#1a2420", border: "1px solid #2e4038", borderRadius: "2px",
                        padding: "1px 5px", fontSize: "10px", color: "#6b9e8a",
                      }}>Equipped</span>
                    )}
                    {item.rarity && item.rarity !== "common" && (
                      <span style={{ color: RARITY_COLORS[item.rarity], fontSize: "10px" }}>◆</span>
                    )}
                  </div>
                  <div style={{ color: "#7a7060", fontSize: "11px", fontFamily: "'Inter', sans-serif" }}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)} · {item.weight} lb
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ color: "#7a7060", fontSize: "14px", padding: "32px 20px", textAlign: "center", fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}>
                No items found.
              </div>
            )}
          </div>

          {/* Item detail */}
          {selected && (
            <div style={{ width: "280px", flexShrink: 0, padding: "20px", overflowY: "auto" }} className="scrollable">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: "#c9a84c" }}><ItemIcon category={selected.category} /></span>
                <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#e8e0d0", margin: 0, fontWeight: 500 }}>{selected.name}</h3>
              </div>
              <div style={{ color: "#7a7060", fontSize: "12px", fontFamily: "'Inter', sans-serif", marginBottom: "14px" }}>
                {selected.category.charAt(0).toUpperCase() + selected.category.slice(1)}
                {selected.rarity && selected.rarity !== "common" && (
                  <span style={{ color: RARITY_COLORS[selected.rarity], marginLeft: "8px" }}>
                    {selected.rarity.charAt(0).toUpperCase() + selected.rarity.slice(1)}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "15px", color: "#b0a898", lineHeight: 1.6, fontStyle: "italic", marginBottom: "16px" }}>
                "{selected.description}"
              </p>
              {selected.properties && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: "#7a7060", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Properties</div>
                  {selected.properties.map(p => (
                    <div key={p} style={{ color: "#b0a898", fontSize: "12px", fontFamily: "'Inter', sans-serif", padding: "3px 0", borderBottom: "1px solid #1f1c18" }}>
                      {p}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mb-3">
                <div style={{ flex: 1, backgroundColor: "#231f1a", border: "1px solid #2e2b27", borderRadius: "4px", padding: "8px", textAlign: "center" }}>
                  <div style={{ color: "#7a7060", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Weight</div>
                  <div style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>{selected.weight} lb</div>
                </div>
                <div style={{ flex: 1, backgroundColor: "#231f1a", border: "1px solid #2e2b27", borderRadius: "4px", padding: "8px", textAlign: "center" }}>
                  <div style={{ color: "#7a7060", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Value</div>
                  <div style={{ color: "#e8e0d0", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>{selected.value}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.equipped ? (
                  <ActionBtn label="Unequip" />
                ) : (
                  selected.category === "weapons" || selected.category === "armor" ? <ActionBtn label="Equip" primary /> : null
                )}
                {selected.category === "consumables" && <ActionBtn label="Use" primary />}
                <ActionBtn label="Inspect" />
                {selected.category !== "quest" && <ActionBtn label="Drop" danger />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, primary, danger }: { label: string; primary?: boolean; danger?: boolean }) {
  return (
    <button
      style={{
        backgroundColor: primary ? "#c9a84c" : danger ? "transparent" : "#231f1a",
        border: `1px solid ${primary ? "#c9a84c" : danger ? "#60302a" : "#3d3830"}`,
        borderRadius: "3px",
        color: primary ? "#0f0e0d" : danger ? "#c45c3a" : "#b0a898",
        fontSize: "12px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: primary ? 600 : 400,
        padding: "6px 12px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [rightOpen, setRightOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Character");

  return (
    <div style={{ display: "flex", height: "100%", width: "100%", backgroundColor: "#0f0e0d", overflow: "hidden", position: "relative" }}>
      <LeftSidebar
        onInventory={() => setInventoryOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <CenterPanel onInventory={() => setInventoryOpen(true)} />

      {/* Right sidebar toggle when closed */}
      {!rightOpen && (
        <button
          onClick={() => setRightOpen(true)}
          style={{
            position: "absolute",
            right: 0,
            top: "14px",
            width: 28,
            height: 28,
            backgroundColor: "#1a1917",
            border: "1px solid #2e2b27",
            borderRadius: "4px 0 0 4px",
            color: "#7a7060",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <IconChevronLeft />
        </button>
      )}

      <RightSidebar open={rightOpen} onToggle={() => setRightOpen(o => !o)} />

      {inventoryOpen && <InventoryModal onClose={() => setInventoryOpen(false)} />}
    </div>
  );
}
