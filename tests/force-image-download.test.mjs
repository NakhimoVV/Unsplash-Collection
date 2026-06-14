import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const helperPath = join(
  projectRoot,
  'src/features/image-download/lib/forceImageDownload.ts',
)

function loadHelper() {
  const source = readFileSync(helperPath, 'utf8')
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
  }

  vm.runInNewContext(compiled, sandbox, { filename: helperPath })

  return module.exports.forceImageDownload
}

describe('forceImageDownload', () => {
  it('downloads a fetched image through a temporary object URL', async () => {
    const forceImageDownload = loadHelper()
    const blob = new Blob(['image-bytes'], { type: 'image/jpeg' })
    const clicks = []
    const appended = []
    const removed = []
    const link = {
      click: () => clicks.push('click'),
      download: '',
      href: '',
      remove: () => removed.push('link'),
    }
    const documentRef = {
      body: {
        append: (element) => appended.push(element),
      },
      createElement: () => link,
    }
    const fetcher = async (url) => {
      assert.equal(url, 'https://images.unsplash.com/photo.jpg')

      return {
        blob: async () => blob,
      }
    }
    const objectUrls = []
    const revokedUrls = []
    const urlApi = {
      createObjectURL: (value) => {
        assert.equal(value, blob)
        objectUrls.push('blob:test-url')

        return 'blob:test-url'
      },
      revokeObjectURL: (url) => revokedUrls.push(url),
    }

    await forceImageDownload({
      documentRef,
      fileName: 'unsplash-photo.jpg',
      fetcher,
      url: 'https://images.unsplash.com/photo.jpg',
      urlApi,
    })

    assert.equal(link.href, 'blob:test-url')
    assert.equal(link.download, 'unsplash-photo.jpg')
    assert.deepEqual(appended, [link])
    assert.deepEqual(clicks, ['click'])
    assert.deepEqual(removed, ['link'])
    assert.deepEqual(objectUrls, ['blob:test-url'])
    assert.deepEqual(revokedUrls, ['blob:test-url'])
  })
})
