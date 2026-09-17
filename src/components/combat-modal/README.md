# Боевая модалка (Combat Modal)

## Обзор

UI-only реализация модального окна для боя в DND_UI. Модалка автоматически открывается при наличии активного боя (active encounter) и закрывается по его завершении.

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
- Опрашивает API `/api/encounter` каждые 3 секунды
- Показывается, если `encounter.active === true`
- Скрывается, если `encounter === null || encounter.active === false`
- Нельзя закрыть вручную (нет крестика/Escape)

## Контракт API

### GET /api/encounter?playerId={playerId}

**Ответ при наличии активного боя:**

```json
{
  "id": "enc_123",
  "active": true,
  "currentTurnPlayerId": "player_456",
  "combatants": [
    {
      "id": "player_456",
      "name": "Эльдар",
      "type": "player",
      "hp": 45,
      "maxHp": 50,
      "feetFromPlayer": 0,
      "order": 2,
      "isPlayerTurn": true
    },
    {
      "id": "monster_789",
      "name": "Гоблин",
      "type": "monster",
      "hp": 12,
      "maxHp": 15,
      "feetFromPlayer": 20,
      "order": 1
    }
  ],
  "log": [
    {
      "id": "log_1",
      "timestamp": 1705000000000,
      "message": "Начало боя!",
      "actorName": "Мастер"
    }
  ]
}
```

**Ответ при отсутствии боя:**
- `404 Not Found` или `{ "active": false }`

### Требования к полям

- **`feetFromPlayer`** (NEW!) — расстояние от игрока в футах. **Критически важно** для фильтрации целей оружия.
- **`order`** — порядок инициативы (меньше = раньше ходит)
- **`currentTurnPlayerId`** — ID игрока, чей сейчас ход (для блокировки чата)
- **`type`** — `"player" | "npc" | "monster" | "ally"` (только `monster`/`npc` могут быть целями атаки)

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

4. **Ходы врагов** — не логируются в чат
   - Требуется DND_AI добавить события в `log` при ходе врага

## Локализация

Все строки вынесены в `messages/ru.json` и `messages/en.json` под ключом `combat`:

```json
{
  "combat": {
    "title": "Боевой режим",
    "yourTurn": "Ваш ход",
    "enemyTurn": "Ход врага",
    "hp": "ОЗ",
    "distance": "{feet} фт.",
    "attack": "Ударить",
    // ...
  }
}
```

## Зависимости от DND_AI

### Критично для работы:
1. **`feetFromPlayer`** в `ICombatant` — без этого поля фильтрация целей не работает
2. **`GET /api/encounter`** — endpoint должен возвращать структуру выше
3. **`active` флаг** — для автоматического открытия/закрытия модалки

### Опционально (для будущих фич):
- `POST /api/combat/attack` — для реализации атак
- `POST /api/combat/use-potion` — для питья зелий
- Логирование ходов врагов в `encounter.log`

## Тестирование

### Без бэкенда (моки)
1. Временно изменить `getEncounter.ts`:
   ```ts
   return {
     id: "mock_enc",
     active: true,
     currentTurnPlayerId: playerId,
     combatants: [
       { id: playerId, name: "Игрок", type: "player", hp: 50, maxHp: 50, feetFromPlayer: 0, order: 1 },
       { id: "m1", name: "Гоблин", type: "monster", hp: 15, maxHp: 15, feetFromPlayer: 10, order: 2 }
     ],
     log: []
   }
   ```

2. Запустить `npm run dev`
3. Модалка откроется автоматически

### С бэкендом
1. Убедиться, что `NEXT_PUBLIC_API_URL` указывает на DND_AI
2. Запустить бой через мастера
3. Модалка откроется при появлении active encounter

## Производительность

- **Polling interval**: 3 секунды (настраивается в `useEncounter.ts`)
- **Авто-закрытие**: при `active: false` или 404 модалка скрывается
- **Ленивая загрузка**: инвентарь загружается один раз при монтировании `AppLayout`

## Стилизация

Использует Tailwind CSS и цветовую схему проекта:
- `text-foreground`, `text-muted`, `text-accent`
- `border-border`, `bg-panel`, `bg-panel-alt`
- Согласовано с другими модалками (`ShopModal`, `InventoryModal`)

---

**Автор:** Cloud Agent  
**Дата:** 2026-09-17  
**PR:** #11