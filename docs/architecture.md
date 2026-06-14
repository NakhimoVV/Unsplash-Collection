# Architecture

Проект использует Next.js App Router и FSD-подход из
`docs/architecture-rules.md`.

I deliberately excluded AI settings and local rule files (agents.md, docs/architecture-rules.md, and docs/styling-rules.md) from Git tracking.

## Layers

- `src/app` - маршруты, layout, pages и route handlers.
- `src/widgets` - крупные композиционные блоки страниц.
- `src/features` - пользовательские сценарии: поиск, masonry grid,
  изображения коллекции.
- Компоненты features лежат напрямую в своей feature-папке; вложенные
  `ui`-папки в `src/features` не используются.
- Имена feature-папок оформляются в kebab-case, например
  `collection-images`.
- `src/entities` - доменные модели и UI сущностей: image, collection.
- `src/shared` - общие API-клиенты, server actions, hooks, UI, стили,
  константы и утилиты.

## Infrastructure

- Unsplash API изолирован в `src/shared/api/unsplash`.
- Unsplash download tracking uses `links.download_location` through
  `src/shared/api/unsplash`; reusable UI components such as `Button` only
  render link/button semantics and do not contain Unsplash-specific logic.
- Browser-side forced image downloads live in `src/features/image-download`,
  so the user scenario stays outside reusable shared UI and entity models.
- PostgreSQL/Neon доступ изолирован в `src/shared/lib/database`.
- DB row contracts and DB-to-client mappers live inside
  `src/shared/lib/database` so the shared infrastructure layer does not import
  from `entities`.
- Server Actions находятся в `src/shared/lib/actions.ts`.
- Unsplash data is mapped to entity UI models in `src/entities/*/model`.
- Infinite pagination state can be restored from `sessionStorage` through
  `src/shared/hooks/useInfinitePagination` when a feature passes a stable
  `cacheKey`; cache helpers live in `src/shared/lib/infinitePaginationCache`.
  Current opt-in lists are search results and collection images.
- Image lists mark only above-the-fold candidates as eager: the first item in
  each masonry column and the first collection preview. Other list images stay
  lazy-loaded.

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
