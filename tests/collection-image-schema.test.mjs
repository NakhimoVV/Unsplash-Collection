import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const seedRoutePath = join(projectRoot, 'src/app/api/seed/route.ts')

describe('collection_images schema', () => {
  it('allows the same photo id to be stored in several collections', () => {
    const source = readFileSync(seedRoutePath, 'utf8')

    assert.match(source, /PRIMARY KEY\s*\(\s*collection_id\s*,\s*id\s*\)/)
    assert.doesNotMatch(source, /id\s+TEXT\s+PRIMARY\s+KEY/)
  })

  it('stores whether a collection image is protected', () => {
    const source = readFileSync(seedRoutePath, 'utf8')

    assert.match(source, /is_system BOOLEAN NOT NULL DEFAULT false/)
    assert.match(source, /ADD COLUMN is_system BOOLEAN/)
    assert.match(source, /SET is_system = true/)
    assert.match(source, /ALTER COLUMN is_system SET NOT NULL/)
  })

  it('protects system collection images from direct deletion', () => {
    const source = readFileSync(seedRoutePath, 'utf8')

    assert.match(source, /prevent_system_collection_image_delete/)
    assert.match(source, /IF OLD\.is_system THEN/)
    assert.match(source, /CREATE TRIGGER collection_images_system_remove/)
  })
})
