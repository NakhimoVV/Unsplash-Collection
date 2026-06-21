import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const require = createRequire(import.meta.url)
const filterPath = join(
  projectRoot,
  'src/features/photo-collections/lib/filterCollections.ts',
)

function loadFilterCollections() {
  const source = readFileSync(filterPath, 'utf8')
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
    require,
  }

  vm.runInNewContext(compiled, sandbox, { filename: filterPath })

  return module.exports.filterCollections
}

const collections = [
  { id: '1', name: 'Autumn Italy' },
  { id: '2', name: 'Lake' },
  { id: '3', name: 'Italy Autumn Como Lake' },
]

describe('filterCollections', () => {
  it('returns all collections for an empty query', () => {
    const filterCollections = loadFilterCollections()

    assert.deepEqual(
      JSON.parse(JSON.stringify(filterCollections(collections, '  '))),
      collections,
    )
  })

  it('filters collections by a case-insensitive trimmed query', () => {
    const filterCollections = loadFilterCollections()

    assert.deepEqual(
      JSON.parse(JSON.stringify(filterCollections(collections, ' italy '))),
      [collections[0], collections[2]],
    )
  })
})
