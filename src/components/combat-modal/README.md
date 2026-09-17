# Боевая модалка (Combat Modal)

## Обзор

UI-only реализация модального окна для боя в DND_UI. Модалка автоматически открывается при наличии активного боя (active encounter) и закрывается по его завершении.

**Интеграция с бэкендом:** Контракт API соответствует DND_AI PR #22 (ветка `cursor/combat-ui-backend-8f68`).

## Архитектура

Модалка состоит из трех колонок:

```
┌─────────────────────────────────────────────────────────┐
│  [Участники]  │     [Чат боя]      │  [Способности]    │
│               │                     │                   │
│  - Игрок      │  Лог сообщений     │  Оружие:          │
│    HP: 45/50  │                     │  ┌──────────────┐ │
│    5 ft.      │  [Текстовое поле]  │  │ Длинный лук  │ │
│               │  (disabled если     │  │ [Select]     │ │
│  - Монстр     │   не ваш ход)      │  │ [Ударить]    │ │
│    HP: 30/40  │                     │  └──────────────┘ │
│    15 ft.     │                     │                   │
│               │                     │  Зелья:           │
│  ...          │                     │  [Выпить]         │
└─────────────────────────────────────────────────────────┘
```

## Структура компонентов

```
combat-modal/
├── ui/
│   └── combatModal.tsx          # Главный компонент
├── participant-list/
│   ├── ui/participantList.tsx   # Список участников
│   └── participant-card/
│       └── ui/participantCard.tsx # Карточка участника
├── combat-chat/
│   └── ui/combatChat.tsx        # Чат боя
├── abilities-panel/
│   ├── ui/abilitiesPanel.tsx    # Панель способностей
│   ├── weapon-slot/
│   │   └── ui/weaponSlot.tsx    # Слот оружия
│   └── potion-slot/
│       └── ui/potionSlot.tsx    # Слот зелья
├── hooks/
│   ├── useEncounter.ts          # Опрос encounter API
│   └── useWeaponTargets.ts      # Фильтрация целей
├── helpers/
│   └── getWeaponsFromInventory.ts # Извлечение оружия
├── api/
│   ├── env.ts
│   └── getEncounter.ts          # GET /api/encounter
└── types/
    └── index.ts                 # TypeScript типы
```

## Интеграция

Модалка интегрирована в `AppLayout`:

```tsx
import { CombatModal } from "@/components/combat-modal"

// В компоненте:
const { items } = useCombatItems() // загрузка инвентаря
const playerId = process.env.NEXT_PUBLIC_PLAYER_ID ?? ""

return (
  <>
    {/* остальные компоненты */}
    <CombatModal items={items} playerId={playerId} />
  </>
)
```

Модалка сама:
- Опрашивает API `/api/encounter/active` каждые 3 секунды
- Показывается, если `hasActiveEncounter === true`
- Скрывается, если `hasActiveEncounter === false` или `encounter === null`
- Нельзя закрыть вручную (нет крестика/Escape)

## Контракт API (реализован в DND_AI PR #22)

### GET /api/encounter/active?campaignId={id}&playerId={id}

**Ответ при наличии активного боя:**

```json
{
  "hasActiveEncounter": true,
  "encounter": {
    "encounterId": "enc_abc123",
    "round": 1,
    "currentTurnIndex": 0,
    "status": "active",
    "currentParticipantId": "participant_xyz",
    "isPlayerTurn": true,
    "participants": [
      {
        "id": "participant_player",
        "kind": "player",
        "displayName": "Эльдар",
        "hpCurrent": 45,
        "hpMax": 50,
        "initiative": 18,
        "feetFromPlayer": 0,
        "isOut": false,
        "playerId": "player_123",
        "npcId": null,
        "monsterInstanceId": null
      },
      {
        "id": "participant_goblin",
        "kind": "monster",
        "displayName": "Гоблин",
        "hpCurrent": 12,
        "hpMax": 15,
        "initiative": 14,
        "feetFromPlayer": 20,
        "isOut": false,
        "playerId": null,
        "npcId": null,
        "monsterInstanceId": "monster_456"
      }
    ]
  }
}
```

**Ответ при отсутствии боя:**

```json
{
  "hasActiveEncounter": false,
  "encounter": null
}
```

### Маппинг полей в UI типы

| Бэкенд поле | UI поле | Описание |
|-------------|---------|----------|
| `hasActiveEncounter` | `encounter.active` | Флаг активного боя |
| `encounter.encounterId` | `encounter.id` | ID боя |
| `encounter.round` | `encounter.round` | Номер раунда |
| `encounter.isPlayerTurn` | `encounter.isPlayerTurn` | Ход игрока |
| `encounter.currentParticipantId` | используется для `isPlayerTurn` в карточке | Чей сейчас ход |
| `participants[].id` | `combatants[].id` | ID участника |
| `participants[].kind` | `combatants[].type` | Тип: `player`, `npc`, `monster` |
| `participants[].displayName` | `combatants[].name` | Отображаемое имя |
| `participants[].hpCurrent` | `combatants[].hp` | Текущее HP |
| `participants[].hpMax` | `combatants[].maxHp` | Максимальное HP |
| `participants[].initiative` | `combatants[].initiative` | Инициатива (для сортировки) |
| `participants[].feetFromPlayer` | `combatants[].feetFromPlayer` | Расстояние до игрока в футах |
| `participants[].isOut` | `combatants[].isOut` | Выбыл из боя |

### Сортировка участников

Участники отображаются в порядке убывания инициативы (`initiative DESC`):

```typescript
const sortedParticipants = [...data.encounter.participants].sort(
  (a, b) => b.initiative - a.initiative,
)
```

### Требования к полям

- **`feetFromPlayer`** — расстояние от игрока в футах. Критично для фильтрации целей оружия.
  - ⚠️ **Graceful degradation**: Если поле отсутствует (`undefined`), показывается "? фт." и враг исключается из целей атаки
- **`initiative`** — для сортировки участников по порядку хода
- **`isPlayerTurn`** — для блокировки чата и визуальной индикации
- **`kind`** — `"player" | "npc" | "monster"` (только `monster`/`npc` могут быть целями атаки)
- **`status`** — для определения активности боя (`"active"`)

## Фильтрация целей оружия

Оружие извлекается из инвентаря игрока. Для каждого оружия проверяются `properties`:

### Рукопашное оружие (Melee)
Если `properties` не содержит `range(...)`:
- Доступны цели с `feetFromPlayer <= 5`

### Дальнобойное оружие (Ranged)
Если `properties` содержит `"range(X/Y)"` или `"range(X)"`:
- Извлекается `normal` range (X)
- Доступны цели с `feetFromPlayer <= normal`
- `long` range (Y) пока не используется

**Пример свойства оружия:**
```json
{
  "id": "item_longbow",
  "name": "Длинный лук",
  "kind": "weapon",
  "properties": [
    "range(150/600)",
    "two-handed",
    "ammunition"
  ]
}
```

Парсинг в `getWeaponsFromInventory.ts`:
- Ищет паттерн `range\s*\((\d+)(?:\/(\d+))?\)`
- Извлекает `normal` (150 ft) и опционально `long` (600 ft)

## Продвижение хода врага

### POST /api/encounter/advance

**Цель:** Продвинуть ход врага (монстра) и получить обновлённое состояние боя.

**Контракт (адаптивный):**
- **Query params** или **Body**: `campaignId`, `playerId`
- Клиент поддерживает оба варианта: query params в URL + те же поля в body

**Запрос:**
```http
POST /api/encounter/advance?campaignId={id}&playerId={id}
Content-Type: application/json

{
  "campaignId": "...",
  "playerId": "..."
}
```

**Ответ (успех):**
```json
{
  "hasActiveEncounter": true,
  "encounter": {
    "encounterId": "enc_abc123",
    "round": 1,
    "currentTurnIndex": 1,
    "status": "active",
    "currentParticipantId": "participant_player",
    "isPlayerTurn": true,
    "participants": [...],
    "log": [
      {
        "id": "log_1",
        "timestamp": 1726611234000,
        "message": "Гоблин атакует игрока и промахивается.",
        "actorName": "Гоблин"
      }
    ]
  }
}
```

**Ответ (ошибка — ход игрока):**
```json
{
  "code": "PLAYER_TURN",
  "message": "Cannot advance during player turn"
}
```
HTTP 400

**UI реализация:**
- Кнопка «Следующий ход» видна только когда `!isPlayerTurn`
- При клике отправляется `POST /api/encounter/advance`
- Loading state: кнопка disabled с текстом "Продвигаем ход…"
- После успеха: `encounter` обновляется, лог и HP участников обновляются
- Ошибка `PLAYER_TURN` показывается в красной полосе над чатом

## Текущие ограничения (TODO)

1. **Кнопка "Ударить"** — только `console.log`, не вызывает API
   - Требуется endpoint: `POST /api/combat/attack`
   - Payload: `{ weaponId, targetId, encounterId }`

2. **Кнопка "Выпить"** — только `console.log`, не вызывает API
   - Требуется endpoint: `POST /api/combat/use-potion`
   - Payload: `{ itemId, encounterId }`

3. **Отправка сообщений в чат** — только `console.log`
   - Требуется endpoint: `POST /api/combat/message`
   - Payload: `{ message, encounterId }`

## Локализация

Все строки вынесены в `messages/ru.json` и `messages/en.json` под ключом `combat`:

```json
{
  "combat": {
    "title": "Боевой режим",
    "round": "Раунд {number}",
    "yourTurn": "Ваш ход",
    "enemyTurn": "Ход врага",
    "hp": "ОЗ",
    "distance": "{feet} фт.",
    "distanceUnknown": "? фт.",
    "attack": "Ударить",
    // ...
  }
}
```

## Зависимости от DND_AI

### Реализовано в DND_AI PR #22 (`cursor/combat-ui-backend-8f68`):
1. ✅ **`GET /api/encounter/active`** — endpoint возвращает структуру выше
2. ✅ **`feetFromPlayer`** в `participants` — для фильтрации целей
3. ✅ **`isPlayerTurn` флаг** — для блокировки чата
4. ✅ **`hasActiveEncounter`** — для автоматического открытия/закрытия модалки

### Ожидается (для будущих фич):
- `POST /api/combat/attack` — для реализации атак
- `POST /api/combat/use-potion` — для питья зелий
- `POST /api/combat/message` — для отправки сообщений в чат
- Логирование ходов в `encounter.log[]`

## Тестирование

### С бэкендом (DND_AI PR #22)
1. Убедиться, что `NEXT_PUBLIC_API_URL` указывает на DND_AI с PR #22
2. Убедиться, что `NEXT_PUBLIC_COMPANY_ID` и `NEXT_PUBLIC_PLAYER_ID` заданы
3. Запустить бой через мастера
4. Модалка откроется при появлении active encounter
5. Проверить отображение участников, их HP и дистанции
6. Проверить фильтрацию целей по дистанции оружия
7. Проверить блокировку чата не в ход игрока

### Без бэкенда (моки)
1. Временно изменить `getEncounter.ts`:
   ```ts
   return {
     id: "mock_enc",
     active: true,
     round: 1,
     isPlayerTurn: true,
     combatants: [
       {
         id: playerId,
         name: "Игрок",
         type: "player",
         hp: 50,
         maxHp: 50,
         feetFromPlayer: 0,
         initiative: 20,
         isOut: false,
         isPlayerTurn: true
       },
       {
         id: "m1",
         name: "Гоблин",
         type: "monster",
         hp: 15,
         maxHp: 15,
         feetFromPlayer: 10,
         initiative: 14,
         isOut: false
       }
     ],
     log: []
   }
   ```

2. Запустить `npm run dev`
3. Модалка откроется автоматически

## Производительность

- **Polling interval**: 3 секунды (настраивается в `useEncounter.ts`)
- **Авто-закрытие**: при `hasActiveEncounter: false` или `encounter: null` модалка скрывается
- **Ленивая загрузка**: инвентарь загружается один раз при монтировании `AppLayout`
- **Сортировка**: участники сортируются по `initiative DESC` на стороне клиента

## Стилизация

Использует Tailwind CSS и цветовую схему проекта:
- `text-foreground`, `text-muted`, `text-accent`
- `border-border`, `bg-panel`, `bg-panel-alt`
- Согласовано с другими модалками (`ShopModal`, `InventoryModal`)

---

**Автор:** Cloud Agent  
**Дата:** 2026-09-17  
**PR:** [#11](https://github.com/bukinich06-debug/DND_UI/pull/11)  
**Бэкенд:** DND_AI [PR #22](https://github.com/bukinich06-debug/DND_AI/pull/22) (`cursor/combat-ui-backend-8f68`)