# Plan: AI-Powered D&D RPG Interface

## Context

The user wants to build a polished, professional desktop web application UI for an AI-powered text-based D&D RPG game, as specified in `src/imports/pasted_text/dnd-ai-app-ui.md`. The app currently has only a blank `App.tsx` shell. This is a full greenfield build.

## Aesthetic Stance

**Archival + dark mode** — reverent composition, numbered/structured sections, humanist serif for narrative text, clean sans for UI. Not medieval kitsch; more like a premium interactive manuscript.

**Fonts (Google Fonts, Vite `@import` into `src/index.css`):**
- `EB Garamond` — narrative text, character names, location headers (humanist serif)
- `Inter` — UI controls, labels, sidebar data
- `JetBrains Mono` — system events, dice rolls, stat numbers

**Palette (dark fantasy):**
- Background: `#0f0e0d` (near-black, charcoal)
- Card/panel: `#1a1917` (slightly lighter)
- Border: `#2e2b27` (dark warm hairline)
- Primary: `#c9a84c` (muted gold)
- Accent: `#d4b483` (warm parchment)
- Foreground: `#e8e0d0` (warm off-white)
- Muted foreground: `#7a7060` (subdued)
- Secondary: `#231f1a` (panel variant)

## Files to Create/Modify

### `src/index.css`
- Add Google Fonts `@import` for EB Garamond, Inter, JetBrains Mono (before `@import 'tailwindcss'`)
- Add Tailwind v4 CSS custom properties (`@theme`) for the color tokens
- Add base styles: font defaults, scrollbar hiding, selection color

### `src/App.tsx`
Full implementation with React state for:
- `rightSidebarOpen: boolean` — collapsible right sidebar
- `inventoryOpen: boolean` — inventory modal overlay
- `activeTab: string` — left sidebar nav (Character/Inventory/Spells/Journal)
- `actionInput: string` — player text input

## Component Structure (all in App.tsx for simplicity)

```
App
├── Left Sidebar (~280px, fixed)
│   ├── CharacterHeader (avatar icon, name, class, level)
│   ├── VitalStats (HP bar, AC, XP bar)
│   ├── AbilityScores (6 compact stat cards)
│   ├── Equipment (conditions, weapon, armor)
│   └── SidebarNav (Character / Inventory / Spells / Journal buttons)
│
├── Center Panel (flex-grow)
│   ├── LocationHeader (location name, description, AI active indicator, top buttons)
│   ├── AdventureLog (scrollable, distinct message types)
│   │   ├── NarrationMessage (AI DM text, EB Garamond, warm off-white)
│   │   ├── NPCMessage (italic, parchment tint, quote marks)
│   │   ├── PlayerMessage (indented, muted gold, action prefix)
│   │   ├── SystemEvent (mono font, bordered, dice icon)
│   │   └── CombatEvent (red-tinted border, sword icon)
│   └── ActionInput
│       ├── Textarea ("What do you want to do?")
│       ├── SuggestionChips (Talk, Inspect, Search, Attack, Move, Rest)
│       └── SendButton
│
└── Right Sidebar (~300px, collapsible)
    ├── CollapseToggle
    ├── CurrentSituation (location, time, weather, circumstances)
    ├── NearbyEntities (NPCs, objects, POIs — clickable rows)
    ├── Party (companion cards with HP)
    └── ActiveQuest (objective, progress, secondary objectives)

InventoryModal (overlay, z-50)
├── Header (title, search, weight indicator, close button)
├── CategoryFilters (All / Weapons / Armor / Consumables / Quest / Other)
├── ItemList (compact rows with icon, name, qty, description, weight, rarity)
└── ItemDetail (right panel — name, type, description, properties, actions)
```

## Prototype Content (Aldric, Level 3 Ranger)

- Character: Aldric, Ranger Lv 3, HP 24/28, AC 15, XP 640/900
- Stats: STR 12, DEX 17, CON 13, INT 11, WIS 14, CHA 9
- Equipment: Longbow (+5), Leather Armor (AC 12)
- Location: The Rusty Lantern, Evening, Rainy
- Active quest: "Find the Missing Caravan"
- Adventure log with ~5 messages showing different types
- Inventory: Longbow, Leather Armor, Quiver of Arrows ×20, Healing Potion ×3, Rope 50ft, Letter (Quest item)
- Nearby: Gareth (bartender), Mira (cloaked traveler), Notice Board, Back Door
- Party companion: Sylwen, Cleric Lv 3, HP 18/22

## Key Implementation Details

- Layout: CSS Grid 3-column (`grid-cols-[280px_1fr_300px]`) at root level, `h-screen overflow-hidden`
- Adventure log: `overflow-y-auto` with hidden scrollbar, scrolled to bottom
- Right sidebar collapse: animate width with transition, use `w-0 overflow-hidden` when collapsed
- Inventory modal: fixed inset overlay with backdrop blur
- Message types distinguished by: left border color, font family (Garamond for narration), icon, text color
- No external component library — pure Tailwind classes
- All inline SVG icons (no icon lib dependency)
- Responsive: `md:` breakpoints to hide sidebars on smaller screens

## Verification

1. App renders in the Vite dev server preview (already running)
2. Inventory modal opens/closes via Inventory button in sidebar nav or bottom nav
3. Right sidebar collapses and expands with the toggle button
4. Action suggestion chips fill the textarea with the chip text
5. All 5 message types are visually distinct in the adventure log
6. No console errors, no broken layout
