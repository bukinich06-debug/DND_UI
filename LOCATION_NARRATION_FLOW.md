# Location Narration Flow

## Overview
This document describes how player location changes trigger Master descriptions in the message log.

## Location Change Paths

### 1. World Map Navigation (Direct)
**Path:** User clicks on map → `WorldModal` → `useWorldMap.moveTo` → `goToLocation` API

**Files:**
- `src/components/world-modal/ui/worldModal.tsx` - Modal UI
- `src/components/world-modal/hooks/useWorldMap.ts` - Map state & movement logic
- `src/components/world-modal/api/goToLocation.ts` - API call (PATCH `/api/location/player`)

**Flow:**
1. User opens world map modal
2. User clicks on a location node
3. `moveTo(locationId)` calls `goToLocation(locationId)` API
4. On success, calls `onMoved()` callback
5. `Adventure.handleLocationMoved()` → calls `onLocationChanged()` + `requestLocationLook()`

### 2. Move Action via Composer
**Path:** User selects "move" action → picks exit/path → submits turn → backend moves player

**Files:**
- `src/components/adventure/composer/ui/composer.tsx` - Action composer
- `src/components/adventure/composer/ui/actionForm.tsx` - Move action form
- `src/components/adventure/composer/api/getExits.ts` - Fetch available exits
- `src/components/adventure/composer/helpers/buildTurnText.ts` - Build move description

**Flow:**
1. User selects "move" action chip
2. Form loads exits (parent/child locations)
3. User picks exit OR enters local path
4. On submit, turn is sent via `postTurn` (POST `/api/turn`)
5. Backend processes move and returns replies
6. `useTurn.syncPlace()` detects location change
7. Calls `onLocationChanged()` + automatically calls `requestLocationLook()`

### 3. Implicit Location Changes (via other actions)
**Path:** Any action that results in location change (e.g., falling through a trap, teleportation)

**Flow:**
1. Player submits any turn action
2. Backend processes and may change player location
3. `useTurn.syncPlace()` checks current location after turn
4. If location changed, calls `onLocationChanged()` + `requestLocationLook()`

## Unified Narration System

### Core Components

#### 1. Location Narration API
**File:** `src/components/shared/location-narration/api/requestLocationLook.ts`

**Function:** `requestLocationLook(): Promise<IMasterReply>`
- Calls POST `/api/master` with `campaignId`, `playerId`, and a user message asking for location description
- Message: `"Опиши, где я нахожусь и что вижу вокруг. Это прибытие в локацию."`
- Master uses tools (e.g., location state) to generate the description
- Backend returns `{ verdict, say, check?, toolCalls? }` (standard Master adjudicate result)
- Maps directly to `IMasterReply` format: `{ agent: "master", verdict, say, toolCalls }`

#### 2. Modified `useTurn` Hook
**File:** `src/components/adventure/hooks/useTurn.ts`

**Changes:**
- Added `requestAndAddLocationLook()` internal method
- Exposed `requestLocationLook` in return value
- Modified `syncPlace()` to auto-call location look when location changes
- Location reply is added to entries as a Master entry with unique ID
- Master response includes verdict and tool calls from backend adjudication

#### 3. Adventure Component Wiring
**File:** `src/components/adventure/ui/adventure.tsx`

**Changes:**
- Destructures `requestLocationLook` from `useTurn`
- Added `handleLocationMoved()` async handler
- Wired to `WorldModal.onMoved` callback
- Ensures location look is requested after map navigation

## Display Components

### Master Entry
**File:** `src/components/adventure/log/master-entry/ui/masterEntry.tsx`

Location narration appears as a Master entry in the log:
- Verdict badge (reflects Master's actual verdict from adjudication)
- Narration text (the `say` field from Master response)
- Tool calls (tools Master used to generate the description, if any)

## UI State Synchronization

### Location Display Points
All these components react to `locationEpoch` changes:

1. **Adventure Header** (`src/components/adventure/header/ui/adventureHeader.tsx`)
   - Shows current location name as page title
   - Shows location summary in situation line

2. **Situation Panel** (`src/components/situation-panel/ui/situationPanel.tsx`)
   - Shows location name in situation section

3. **Composer Exits** (`src/components/adventure/composer/hooks/useExits.ts`)
   - Refetches available exits when location changes

4. **Nearby NPCs** (`src/components/situation-panel/nearby-list/hooks/useNearby.ts`)
   - Refetches NPCs at current location

### Location Epoch Pattern
**File:** `src/components/app-layout/hooks/useShell.ts`

- `locationEpoch` is a counter incremented by `bumpLocation()`
- Passed down as `onLocationChanged` callback
- All location-dependent hooks use `locationEpoch` as useEffect dependency
- Ensures consistent refetch across all UI components

## Backend Contract

### Expected Endpoints

1. **POST `/api/master`**
   - Request: `{ campaignId, playerId, messages: [{ role, content }] }`
   - Response: `{ verdict, say, check?, toolCalls? }` (standard Master adjudicate result)
   - Used for location arrival descriptions
   - Master uses tools to determine current location and generate description
   - Client sends a user message requesting location description
   - For in-play location "look" commands, use standard turn flow (POST `/api/turn`)

2. **PATCH `/api/location/player`** (existing)
   - Request: `{ playerId, locationId }`
   - Response: `IPlayerLocation`
   - Direct location change from map

3. **POST `/api/turn`** (existing)
   - Handles all player actions including move and in-play "look" commands
   - May result in location changes

### Reply Format
Location narration returns:
- Backend: `{ verdict, say, check?, toolCalls? }` (Master adjudicate result)
- UI maps to: `IMasterReply` - Master narration entry in the log

## Error Handling

- Location look failures are silent (don't break UI)
- If `/api/master` request fails, log continues without narration entry
- Location display shows error states for fetch failures
- Move action errors shown in composer error area

## Testing Scenarios

1. **Map click navigation**
   - Open world modal
   - Click on connected location
   - Verify narration appears in log
   - Verify header/sidebar update

2. **Exit-based move**
   - Select "move" action
   - Pick exit from dropdown
   - Submit turn
   - Verify narration appears after backend processes

3. **Local path move**
   - Select "move" action
   - Enter local path text
   - Submit turn
   - Backend interprets and may change location

4. **Implicit move**
   - Trigger action that causes location change (backend decision)
   - Verify location change detected
   - Verify narration added to log

## Known Limitations

1. **Narration timing**: Location description is requested immediately after detecting change. No debouncing or deduplication if multiple rapid changes occur.

2. **Separate from turn chat**: Location arrival requests are direct Master calls, not part of the turn chat history. For in-play "look around" commands, use the standard turn flow which maintains chat context.

3. **Master adjudication**: Location arrival now goes through full Master adjudication, which may include tool calls and different verdicts based on game state.

## Future Enhancements

1. **Loading indicator**: Show subtle loading state while fetching location description
2. **Retry logic**: Add retry for failed location look requests
3. **Cached descriptions**: Consider caching recent location descriptions client-side
4. **Transition animations**: Animate location entry appearance in log
5. **Travel progress narration**: Show narration updates during multi-day travel
