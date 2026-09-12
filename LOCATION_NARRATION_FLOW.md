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

**Function:** `requestLocationLook(): Promise<ITurnReply[]>`
- Calls POST `/api/turn/look` with `campaignId` and `playerId`
- Backend Master agent describes current location
- Returns array of reply entries (typically `ILocationReply` or `IMasterReply`)

#### 2. Modified `useTurn` Hook
**File:** `src/components/adventure/hooks/useTurn.ts`

**Changes:**
- Added `requestAndAddLocationLook()` internal method
- Exposed `requestLocationLook` in return value
- Modified `syncPlace()` to auto-call location look when location changes
- Location replies are added to entries with unique IDs

#### 3. Adventure Component Wiring
**File:** `src/components/adventure/ui/adventure.tsx`

**Changes:**
- Destructures `requestLocationLook` from `useTurn`
- Added `handleLocationMoved()` async handler
- Wired to `WorldModal.onMoved` callback
- Ensures location look is requested after map navigation

## Display Components

### Location Entry
**File:** `src/components/adventure/log/location-entry/ui/locationEntry.tsx`

Renders `ILocationReply` in the log:
- Location name (with secret indicator if applicable)
- Summary (narration text)
- Features (additional description)
- Full description (collapsible)

### Master Entry
**File:** `src/components/adventure/log/master-entry/ui/masterEntry.tsx`

Renders `IMasterReply` in the log (if Master chooses this format):
- Verdict badge
- Narration text
- Tool call details (if any)

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

1. **POST `/api/turn/look`**
   - Request: `{ campaignId, playerId }`
   - Response: `{ replies: ITurnReply[] }`
   - Master describes the current location where player stands
   - Returns location/master entries for the log

2. **PATCH `/api/location/player`** (existing)
   - Request: `{ playerId, locationId }`
   - Response: `IPlayerLocation`
   - Direct location change from map

3. **POST `/api/turn`** (existing)
   - Handles all player actions including move
   - May result in location changes

### Reply Types
Location narration can return:
- `ILocationReply` - Structured location data (name, summary, features, description)
- `IMasterReply` - Freeform Master narration with verdict
- Mix of both

## Error Handling

- Location look failures are silent (don't break UI)
- If `/api/turn/look` fails, log continues without narration entry
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

1. **Backend endpoint assumption**: Implementation assumes POST `/api/turn/look` exists. If backend uses different endpoint/structure, adjust `requestLocationLook.ts`.

2. **Narration timing**: Location look is requested immediately after detecting change. No debouncing or deduplication if multiple rapid changes occur.

3. **Chat context**: Location look request is separate from turn chat history. If Master needs conversation context for better descriptions, backend should maintain session state.

## Future Enhancements

1. **Loading indicator**: Show subtle loading state while fetching location description
2. **Retry logic**: Add retry for failed location look requests
3. **Cached descriptions**: Consider caching recent location descriptions client-side
4. **Transition animations**: Animate location entry appearance in log
5. **Travel progress narration**: Show narration updates during multi-day travel
