import React from 'react'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const require = createRequire(import.meta.url)

const testImage = {
  id: 'photo-id',
  width: 400,
  height: 300,
  description: 'Autumn Vibe',
  blur_hash: null,
  urls: {
    small: 'https://images.unsplash.com/photo.jpg?w=400',
  },
  user: {
    name: 'Photo Author',
  },
}

const testCollection = {
  id: 'collection-id',
  name: 'Autumn Vibe',
  count_images: 10,
  preview_images: [
    'https://images.unsplash.com/photo-one.jpg?w=400',
    'https://images.unsplash.com/photo-two.jpg?w=400',
  ],
}

function compileTsx(filePath) {
  const source = readFileSync(filePath, 'utf8')

  return ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText
}

function loadComponent(relativePath, mocks) {
  const filePath = join(projectRoot, relativePath)
  const compiled = compileTsx(filePath)
  const module = { exports: {} }
  const styles = new Proxy(
    {},
    {
      get: (_target, property) => String(property),
    },
  )
  const sandbox = {
    exports: module.exports,
    module,
    require: (id) => {
      if (id in mocks) {
        return mocks[id]
      }

      if (id.endsWith('.module.scss')) {
        return { __esModule: true, default: styles }
      }

      return require(id)
    },
  }

  vm.runInNewContext(compiled, sandbox, { filename: filePath })

  return module.exports.default
}

const commonMocks = {
  'react/jsx-runtime': require('react/jsx-runtime'),
  'next/image': ({ priority, ...props }) => {
    const imageProps = { ...props }

    delete imageProps.blurDataURL
    delete imageProps.fill
    delete imageProps.placeholder

    return React.createElement('img', {
      ...imageProps,
      'data-priority': priority ? 'true' : undefined,
    })
  },
  'next/link': ({ children, href, ...props }) =>
    React.createElement('a', { ...props, href }, children),
}

describe('image loading priority', () => {
  it('passes blur placeholder to masonry images when blur data is available', () => {
    const blurDataURL = 'data:image/png;base64,blurhash'
    const GridElement = loadComponent('src/features/grid/GridElement.tsx', {
      ...commonMocks,
      'next/image': ({ blurDataURL, placeholder, ...props }) =>
        React.createElement('img', {
          ...props,
          'data-blur-data-url': blurDataURL,
          'data-placeholder': placeholder,
        }),
      '@/entities/image/model/type': {},
      '@/shared/hooks/useBlurDataURL': {
        useBlurDataURL: () => blurDataURL,
      },
    })

    const markup = renderToStaticMarkup(
      React.createElement(GridElement, {
        image: testImage,
      }),
    )

    assert.match(markup, /\bdata-placeholder="blur"/)
    assert.match(markup, /\bdata-blur-data-url="data:image\/png/)
    assert.match(markup, /--blur-data-url:url\(&quot;data:image\/png/)
  })

  it('renders the first masonry image eagerly when it is above the fold', () => {
    const GridElement = loadComponent('src/features/grid/GridElement.tsx', {
      ...commonMocks,
      '@/entities/image/model/type': {},
      '@/shared/hooks/useBlurDataURL': {
        useBlurDataURL: () => undefined,
      },
    })

    const markup = renderToStaticMarkup(
      React.createElement(GridElement, {
        image: testImage,
        isAboveFold: true,
      }),
    )

    assert.match(markup, /\bloading="eager"/)
  })

  it('keeps non-leading masonry images lazy', () => {
    const GridElement = loadComponent('src/features/grid/GridElement.tsx', {
      ...commonMocks,
      '@/entities/image/model/type': {},
      '@/shared/hooks/useBlurDataURL': {
        useBlurDataURL: () => undefined,
      },
    })

    const markup = renderToStaticMarkup(
      React.createElement(GridElement, {
        image: testImage,
      }),
    )

    assert.match(markup, /\bloading="lazy"/)
  })

  it('renders the first collection preview eagerly when the collection is above the fold', () => {
    const CollectionItem = loadComponent(
      'src/entities/collection/ui/CollectionItem/CollectionItem.tsx',
      {
        ...commonMocks,
        '@/entities/collection/model/types': {},
      },
    )

    const markup = renderToStaticMarkup(
      React.createElement(CollectionItem, {
        item: testCollection,
        isAboveFold: true,
      }),
    )

    assert.match(markup, /\bloading="eager"/)
  })
})
