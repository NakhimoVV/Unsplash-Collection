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
const blurhashPath = join(projectRoot, 'src/shared/utils/blurhash.ts')

function loadBlurhashUtils(globals = {}) {
  const source = readFileSync(blurhashPath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText

  const module = { exports: {} }
  const sandbox = {
    console,
    exports: module.exports,
    module,
    require,
    ...globals,
  }

  vm.runInNewContext(compiled, sandbox, { filename: blurhashPath })

  return module.exports
}

describe('blurhash placeholders', () => {
  it('returns undefined without browser APIs', () => {
    const { blurHashToDataURL } = loadBlurhashUtils()

    assert.equal(blurHashToDataURL('LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'), undefined)
  })

  it('creates a canvas data URL with browser APIs', () => {
    const calls = {
      createImageData: 0,
      putImageData: 0,
    }
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({
        createImageData: (width, height) => {
          calls.createImageData += 1

          return {
            data: new Uint8ClampedArray(width * height * 4),
          }
        },
        putImageData: () => {
          calls.putImageData += 1
        },
      }),
      toDataURL: () => 'data:image/png;base64,blurhash',
    }
    const { blurHashToDataURL } = loadBlurhashUtils({
      document: {
        createElement: () => canvas,
      },
      window: {},
    })
    const dataURL = blurHashToDataURL('LGF5]+Yk^6#M@-5c,1J5@[or[Q6.')

    assert.equal(canvas.width, 32)
    assert.equal(canvas.height, 32)
    assert.equal(calls.createImageData, 1)
    assert.equal(calls.putImageData, 1)
    assert.equal(dataURL, 'data:image/png;base64,blurhash')
  })
})
