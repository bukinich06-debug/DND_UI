# Контракт UI с бэкендом для завершения хода и итогов боя

## POST /api/encounter/advance

**Назначение:** Завершить ход игрока

### Request
```json
{
  "campaignId": "string",
  "playerId": "string"
}
```

### Response (успех)
```json
{
  "success": true,
  "encounter": {
    "encounterId": "string",
    "round": "number",
    "currentTurnIndex": "number",
    "status": "active" | "ended",
    "currentParticipantId": "string",
    "isPlayerTurn": "boolean",
    "participants": [
      {
        ...
        "isOut": "boolean"  // true для выбывших участников
      }
    ],
    "log": [...],
    "outcome": {  // только если status === "ended"
      "victory": "boolean"
    }
  }
}
```

### Response (ошибка)
```json
{
  "success": false,
  "errorCode": "PLAYER_TURN" | "COMBAT_ENDED"
}
```

## POST /api/encounter/player-turn

**Изменения:** добавлено поле `say` в ответ

### Response
```json
{
  "success": true,
  "say": "string",  // НОВОЕ: сообщение агента боя (например, "Основное действие уже использовано")
  "encounter": {
    ...
  }
}
```

### Response (ошибка)
```json
{
  "error": "string"  // НОВОЕ: текст ошибки от сервера
}
```

## GET /api/encounter/active

**Изменения:** добавлено поле `outcome` в encounter

### Response
```json
{
  "hasActiveEncounter": "boolean",
  "encounter": {
    ...
    "outcome": {  // НОВОЕ: только если status === "ended"
      "victory": "boolean"
    }
  }
}
```

## Поведение UI

1. **На ходу игрока** показывается кнопка "Закончить ход", которая вызывает `POST /api/encounter/advance`
2. **Когда `encounter.status === "ended"`:**
   - Если есть `encounter.outcome` — показывается экран итогов боя с результатом (победа/поражение) и списком выбывших
   - Если нет `outcome` — модалка просто закрывается (старое поведение)
3. **Say агента** из ответа `/player-turn` отображается в чате боя в отдельном блоке и автоматически скрывается через 5 секунд
4. **При ошибке сети** модалка не закрывается, показывается сообщение "Ошибка сети. Повтор..."

## Экран итогов боя

Отображает:
- **Результат:** "Победа!" или "Поражение"
- **Список выбывших** (если есть участники с `isOut: true`): показывает имена всех, кто выбыл из боя
- Кнопка **"Закрыть"**
