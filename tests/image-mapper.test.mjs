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
const mapperPath = join(
  projectRoot,
  'src/entities/image/model/mappers/fromUnsplash.ts',
)

function loadMapper() {
  const source = readFileSync(mapperPath, 'utf8')
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
    require: (id) => {
      if (id.startsWith('@/')) {
        return {}
      }

      return require(id)
    },
  }

  vm.runInNewContext(compiled, sandbox, { filename: mapperPath })

  return module.exports
}

const unsplashPhoto = {
  id: 'photo-id',
  alt_description: 'Mountain lake at sunset',
  blur_hash: undefined,
  created_at: '2026-06-14T10:00:00Z',
  description: null,
  height: 3000,
  links: {
    download: 'https://unsplash.com/photos/photo-id/download',
    download_location: 'https://api.unsplash.com/photos/photo-id/download',
    html: 'https://unsplash.com/photos/photo-id',
    self: 'https://api.unsplash.com/photos/photo-id',
  },
  urls: {
    full: 'https://images.unsplash.com/photo.jpg?w=2400',
    raw: 'https://images.unsplash.com/photo.jpg',
    regular: 'https://images.unsplash.com/photo.jpg?w=1080',
    small: 'https://images.unsplash.com/photo.jpg?w=400',
    thumb: 'https://images.unsplash.com/photo.jpg?w=200',
  },
  user: {
    id: 'user-id',
    name: 'Photo Author',
    profile_image: {
      large: 'https://images.unsplash.com/profile-large.jpg',
      medium: 'https://images.unsplash.com/profile-medium.jpg',
      small: 'https://images.unsplash.com/profile-small.jpg',
    },
  },
  width: 4000,
}

describe('image mappers', () => {
  it('maps an Unsplash photo response to a detail image model', () => {
    const { fromUnsplashPhoto } = loadMapper()
    const photo = JSON.parse(JSON.stringify(fromUnsplashPhoto(unsplashPhoto)))

    assert.deepEqual(photo, {
      id: 'photo-id',
      altDescription: 'Mountain lake at sunset',
      blur_hash: null,
      created_at: '2026-06-14T10:00:00Z',
      description: null,
      height: 3000,
      links: {
        download: 'https://unsplash.com/photos/photo-id/download',
        downloadLocation: 'https://api.unsplash.com/photos/photo-id/download',
        html: 'https://unsplash.com/photos/photo-id',
        self: 'https://api.unsplash.com/photos/photo-id',
      },
      urls: {
        full: 'https://images.unsplash.com/photo.jpg?w=2400',
        regular: 'https://images.unsplash.com/photo.jpg?w=1080',
        small: 'https://images.unsplash.com/photo.jpg?w=400',
        thumb: 'https://images.unsplash.com/photo.jpg?w=200',
      },
      user: {
        id: 'user-id',
        name: 'Photo Author',
        profile_image: {
          large: 'https://images.unsplash.com/profile-large.jpg',
          medium: 'https://images.unsplash.com/profile-medium.jpg',
          small: 'https://images.unsplash.com/profile-small.jpg',
        },
      },
      width: 4000,
    })
  })
})
