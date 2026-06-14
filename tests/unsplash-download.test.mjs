import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const apiPath = join(projectRoot, 'src/shared/api/unsplash/index.ts')

function loadUnsplashApi(fetchMock) {
  const source = readFileSync(apiPath, 'utf8')
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
    fetch: fetchMock,
    module,
    process: {
      env: {
        UNSPLASH_ACCESS_KEY: 'test-key',
      },
    },
    require: () => ({}),
  }

  vm.runInNewContext(compiled, sandbox, { filename: apiPath })

  return module.exports.unsplashApi
}

describe('unsplashApi download tracking', () => {
  it('requests an absolute download_location URL without prefixing the base URL', async () => {
    const downloadLocation = 'https://api.unsplash.com/photos/photo-id/download'
    const downloadUrl = 'https://images.unsplash.com/photo.jpg'
    const requestedUrls = []
    const fetchMock = async (url) => {
      requestedUrls.push(url)

      return {
        json: async () => ({ url: downloadUrl }),
        ok: true,
      }
    }
    const unsplashApi = loadUnsplashApi(fetchMock)

    const result = await unsplashApi.getFilePhoto(downloadLocation)

    assert.deepEqual(requestedUrls, [downloadLocation])
    assert.deepEqual(result, { url: downloadUrl })
  })
})
