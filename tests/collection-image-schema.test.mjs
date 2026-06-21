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
})
