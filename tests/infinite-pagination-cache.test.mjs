import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const cachePath = join(projectRoot, 'src/shared/lib/infinitePaginationCache.ts')

function loadInfinitePaginationCache() {
  const source = readFileSync(cachePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText

  const module = { exports: {} }
  const sandbox = {
    exports: module.exports,
    module,
    require: () => ({}),
  }

  vm.runInNewContext(compiled, sandbox, { filename: cachePath })

  return module.exports
}

function createStorage() {
  const values = new Map()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
}

describe('infinite pagination cache', () => {
  it('restores saved pagination state by cache key', () => {
    const { readInfinitePaginationCache, writeInfinitePaginationCache } =
      loadInfinitePaginationCache()
    const storage = createStorage()
    const image = { id: 'photo-1' }

    writeInfinitePaginationCache(
      'search:mountains',
      {
        hasMore: true,
        items: [image],
        page: 2,
      },
      storage,
    )

    const cachedState = readInfinitePaginationCache('search:mountains', storage)

    assert.equal(
      JSON.stringify(cachedState),
      JSON.stringify({
        hasMore: true,
        items: [image],
        page: 2,
      }),
    )
  })

  it('returns null for invalid cached data', () => {
    const { readInfinitePaginationCache } = loadInfinitePaginationCache()
    const storage = createStorage()
    storage.setItem('infinite-pagination:broken', '{')

    assert.equal(readInfinitePaginationCache('broken', storage), null)
  })
})
