# Architecture

Проект использует Next.js App Router и FSD-подход из
`docs/architecture-rules.md`.

I deliberately excluded AI settings and local rule files (agents.md, docs/architecture-rules.md, and docs/styling-rules.md) from Git tracking.

README uses the same portfolio structure as sibling projects: centered title,
key features, table of contents, overview thumbnail, stack, and author links.

## Layers

- `src/app` - маршруты, layout, pages и route handlers.
- `src/widgets` - крупные композиционные блоки страниц.
- `src/features` - пользовательские сценарии: поиск, masonry grid,
  изображения коллекции, добавление фото в коллекции.
- Компоненты features лежат напрямую в своей feature-папке; вложенные
  `ui`-папки в `src/features` не используются.
- Имена feature-папок оформляются в kebab-case, например
  `collection-images`; регистр пути в Git должен оставаться lowercase, чтобы
  сборка на Linux/Vercel совпадала с локальными импортами.
- Case-only переименования feature-папок фиксируются через `git mv`, иначе
  Windows может показывать рабочий lowercase-путь, пока Git хранит старый
  регистр для Vercel/Linux.
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
- Photo collection membership UI lives in `src/features/photo-collections`.
  It owns the client-side collection list state, Radix Dialog modal, local
  search, add/remove controls, and calls server actions from `src/shared`.
- Collection creation UI lives in `src/features/add-collection`. It owns the
  create-collection card and modal form; its server action validates and
  persists a non-empty collection name through `src/shared/lib/database` and
  revalidates the collection list.
- The collection list route uses dynamic rendering because its database-backed
  previews and image counts must reflect collection and membership changes.
- Collection deletion UI lives in `src/features/remove-collection`. It owns
  the confirmation modal and invokes a server action that deletes only
  non-system collections, then revalidates the collection list.
- PostgreSQL/Neon доступ изолирован в `src/shared/lib/database`.
- Default `Ocean` and `Autumn Vibe` collections have `is_system = true` and
  are protected from deletion by both the UI and the PostgreSQL
  `prevent_system_delete` trigger.
- DB row contracts and DB-to-client mappers live inside
  `src/shared/lib/database` so the shared infrastructure layer does not import
  from `entities`.
- Server Actions находятся в `src/shared/lib/actions.ts`.
- Collection membership writes are server-only: client components call server
  actions, actions load full Unsplash photo data on the server, and
  `src/shared/lib/database` persists or removes `collection_images` rows.
- `collection_images` uses a composite primary key `(collection_id, id)`, so
  one Unsplash photo can belong to multiple collections while staying unique
  inside each collection.
- Unsplash data is mapped to entity UI models in `src/entities/*/model`;
  detailed photo routes use an `ImageDetails` model so page UI does not depend
  on raw Unsplash response field names such as `alt_description` or
  `download_location`.
- The base `Image` entity model contains only fields used by image list/grid UI;
  detail-only fields are kept in `ImageDetails`.
- Infinite pagination state can be restored from `sessionStorage` through
  `src/shared/hooks/useInfinitePagination` when a feature passes a stable
  `cacheKey`; cache helpers live in `src/shared/lib/infinitePaginationCache`.
  Current opt-in lists are search results and collection images.
- Long infinite image grids use `src/features/scroll-to-top` to expose a
  viewport-fixed return-to-top control after deep scrolling.
- Image lists mark only above-the-fold candidates as eager: the first item in
  each masonry column and the first collection preview. Other list images stay
  lazy-loaded.
- Blurhash placeholders for image lists use a hybrid loading state: image
  containers render a neutral CSS fallback immediately, then `src/shared/hooks`
  decodes `blur_hash` through canvas on the client and passes the resulting
  data URL to the container background and `next/image`.

## Dependency Maintenance

- Используется только `pnpm`; lockfile `pnpm-lock.yaml` должен обновляться
  вместе с `package.json`.
- После обновления зависимостей запускать минимум `pnpm lint` и `pnpm build`.
- `@radix-ui/react-dialog` is used as the accessible headless Dialog primitive
  for the photo collections modal; styling remains SCSS Modules.

## Quality Checks

- `pnpm check` runs all static checks.
- `pnpm lint` checks TypeScript/JavaScript with Next ESLint rules and import
  sorting.
- `pnpm lint:types` runs TypeScript type checking without emitting files.
- `pnpm lint:styles` checks SCSS/CSS with Stylelint.
