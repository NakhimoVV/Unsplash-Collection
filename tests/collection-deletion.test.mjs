import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const databasePath = join(projectRoot, 'src/shared/lib/database/index.ts')
const actionsPath = join(projectRoot, 'src/shared/lib/actions.ts')
const collectionsPagePath = join(projectRoot, 'src/app/collections/page.tsx')
const seedRoutePath = join(projectRoot, 'src/app/api/seed/route.ts')
const removeCollectionPath = join(
  projectRoot,
  'src/features/remove-collection/RemoveCollection.tsx',
)
const photoCollectionsPath = join(
  projectRoot,
  'src/features/photo-collections/PhotoCollectionsSection.tsx',
)

describe('collection deletion', () => {
  it('deletes only non-system collections in the database layer', () => {
    const source = readFileSync(databasePath, 'utf8')

    assert.match(
      source,
      /DELETE FROM collections\s+WHERE id = \$\{id\}\s+AND is_system = false/,
    )
  })

  it('revalidates the collection route after deletion', () => {
    const source = readFileSync(actionsPath, 'utf8')

    assert.match(source, /export async function deleteCollection\(id: string\)/)
    assert.match(
      source,
      /await deleteCollectionRecord\(id\)[\s\S]*revalidatePath\('\/collections'\)/,
    )
  })

  it('renders the control only for non-system collections', () => {
    const source = readFileSync(collectionsPagePath, 'utf8')

    assert.match(source, /collection\.is_system \? null : \(/)
    assert.match(
      source,
      /<RemoveCollection id=\{collection\.id\} name=\{collection\.name\} \/>/,
    )
  })

  it('uses an accessible Remove icon trigger and confirmation dialog', () => {
    const source = readFileSync(removeCollectionPath, 'utf8')

    assert.match(
      source,
      /IconRemove from '@\/shared\/assets\/icons\/Remove\.svg'/,
    )
    assert.match(source, /aria-label="Delete collection"/)
    assert.match(source, /title="Delete collection"/)
    assert.match(source, /<Dialog\.Content/)
    assert.match(source, /Delete collection\?/)
  })

  it('removes only non-system collection images in the database layer', () => {
    const source = readFileSync(databasePath, 'utf8')

    assert.match(
      source,
      /DELETE FROM collection_images[\s\S]*AND is_system = false/,
    )
  })

  it('does not render Remove for protected collection images', () => {
    const source = readFileSync(photoCollectionsPath, 'utf8')

    assert.match(source, /!collection\.isCurrentPhotoSystem/)
  })

  it('can recreate the default collection deletion trigger during repeated seeds', () => {
    const source = readFileSync(seedRoutePath, 'utf8')

    assert.match(source, /DROP TRIGGER IF EXISTS collections_system_remove/)
  })
})
