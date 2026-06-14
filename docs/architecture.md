# Architecture

Проект использует Next.js App Router и FSD-подход из
`docs/architecture-rules.md`.

I deliberately excluded AI settings and local rule files (agents.md, docs/architecture-rules.md, and docs/styling-rules.md) from Git tracking.

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
- PostgreSQL/Neon доступ изолирован в `src/shared/lib/database`.
- DB row contracts and DB-to-client mappers live inside
  `src/shared/lib/database` so the shared infrastructure layer does not import
  from `entities`.
- Server Actions находятся в `src/shared/lib/actions.ts`.
- Unsplash data is mapped to entity UI models in `src/entities/*/model`.

## Dependency Maintenance

- Используется только `pnpm`; lockfile `pnpm-lock.yaml` должен обновляться
  вместе с `package.json`.
- После обновления зависимостей запускать минимум `pnpm lint` и `pnpm build`.

## Quality Checks

- `pnpm check` runs all static checks.
- `pnpm lint` checks TypeScript/JavaScript with Next ESLint rules and import
  sorting.
- `pnpm lint:types` runs TypeScript type checking without emitting files.
- `pnpm lint:styles` checks SCSS/CSS with Stylelint.
