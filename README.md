# DND-UI

UI for an **AI Dungeon Master** (ИИ-мастер). This repo is the **frontend only**.

The server, API, business logic, and database live in a **separate project**. Do not recreate them here.

---

## Scope (read this first)

| Allowed | Forbidden |
|--------|-----------|
| React / Next.js UI | Backend / Node server logic |
| Components, hooks, styles, i18n | Database, Prisma, ORM, migrations |
| Calling an **external** API (client `fetch`) | `'use server'`, Route Handlers as a backend |
| Layout, pages, client state | Domain / services / data layers in this repo |

**In short:** solve **UI tasks only**. No backend work in this repository.

---

## Для ИИ-агентов / For AI agents

Перед любой задачей прочитай этот файл и соблюдай границы:

1. Этот проект — **только UI** для ИИ-мастера.
2. Серверная часть и БД — **в другом репозитории**. Здесь их нет и создавать нельзя.
3. **Запрещено** делать что-либо на стороне бэка (Node): Server Actions как бэкенд, API routes с бизнес-логикой, доступ к БД, репозитории, domain/services/data.
4. Разрешено: React-компоненты, хуки, стили, локализация, тонкие Next.js pages/layouts, клиентские запросы к уже существующему внешнему API.
5. Если задача звучит как «добавь бэкенд / схему / сервис / Prisma» — **отклони** и предложи только UI (или интеграцию через клиентский вызов внешнего API).

Before any task, read this file and stay in scope:

1. This project is **UI only** for the AI Dungeon Master.
2. Server and database belong to **another repo** — do not add them here.
3. **Do not** implement backend/Node work: Server Actions as a backend, API routes with business logic, DB access, repositories, domain/services/data layers.
4. **Do** implement React UI, hooks, styles, i18n, thin Next.js pages/layouts, and client calls to an existing external API.
5. If a request asks for backend / schema / services / Prisma — **refuse** and stick to UI (or client-side integration with the external API).

See also: `AGENTS.md`, `.cursor/rules/`.
