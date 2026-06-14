import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const sharedFiles = globSync('src/shared/**/*.{ts,tsx}', {
  cwd: projectRoot,
  exclude: ['**/*.d.ts'],
})

describe('architecture boundaries', () => {
  it('keeps shared layer independent from upper FSD layers', () => {
    const upperLayerImport = /from\s+['"]@\/(app|widgets|features|entities)\//
    const violations = sharedFiles.flatMap((file) => {
      const content = readFileSync(join(projectRoot, file), 'utf8')

      return content
        .split('\n')
        .map((line, index) => ({
          file: relative(projectRoot, join(projectRoot, file)),
          line: index + 1,
          source: line.trim(),
        }))
        .filter(({ source }) => upperLayerImport.test(source))
    })

    assert.deepEqual(violations, [])
  })
})
