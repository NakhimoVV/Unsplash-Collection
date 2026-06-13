# Architecture

Проект использует Next.js App Router и FSD-подход из
`docs/architecture-rules.md`.

## Layers

- `src/app` - маршруты, layout, pages и route handlers.
- `src/widgets` - крупные композиционные блоки страниц.
- `src/features` - пользовательские сценарии: поиск, masonry grid,
  изображения коллекции.
- `src/entities` - доменные модели и UI сущностей: image, collection.
- `src/shared` - общие API-клиенты, server actions, hooks, UI, стили,
  константы и утилиты.

## Infrastructure

- Unsplash API изолирован в `src/shared/api/unsplash`.
- PostgreSQL/Neon доступ изолирован в `src/shared/lib/database.ts`.
- Server Actions находятся в `src/shared/lib/actions.ts`.
- Внешние данные приводятся к UI-моделям через mapper-функции в
  `src/entities/*/model`.

## Dependency Maintenance

- Используется только `pnpm`; lockfile `pnpm-lock.yaml` должен обновляться
  вместе с `package.json`.
- После обновления зависимостей запускать минимум `pnpm lint` и `pnpm build`.
