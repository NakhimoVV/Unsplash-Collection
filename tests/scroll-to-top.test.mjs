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

function compileTs(filePath) {
  const source = readFileSync(filePath, 'utf8')

  return ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText
}

function createStylesMock() {
  return new Proxy(
    {},
    {
      get: (_target, property) => String(property),
    },
  )
}

function loadTsModule(relativePath, mocks = {}) {
  const filePath = join(projectRoot, relativePath)
  const compiled = compileTs(filePath)
  const module = { exports: {} }
  const sandbox = {
    exports: module.exports,
    module,
    require: (id) => {
      if (id in mocks) {
        return mocks[id]
      }

      return require(id)
    },
  }

  vm.runInNewContext(compiled, sandbox, { filename: filePath })

  return module.exports
}

function loadTsxModule(relativePath, mocks = {}) {
  const filePath = join(projectRoot, relativePath)
  const compiled = compileTsx(filePath)
  const module = { exports: {} }
  const styles = createStylesMock()
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

      if (id.endsWith('.svg')) {
        return {
          __esModule: true,
          default: (props) => React.createElement('svg', props),
        }
      }

      return require(id)
    },
  }

  vm.runInNewContext(compiled, sandbox, { filename: filePath })

  return module.exports
}

describe('scroll to top feature', () => {
  it('shows after scrolling past one and a half viewports', () => {
    const { shouldShowScrollToTop } = loadTsModule(
      'src/features/scroll-to-top/lib/scrollToTop.ts',
    )

    assert.equal(shouldShowScrollToTop(1199, 800), false)
    assert.equal(shouldShowScrollToTop(1201, 800), true)
  })

  it('scrolls to the page top smoothly', () => {
    const calls = []
    const { scrollToPageTop } = loadTsModule(
      'src/features/scroll-to-top/lib/scrollToTop.ts',
      {
        '@/features/scroll-to-top/lib/scrollToTop': {},
      },
    )

    scrollToPageTop({
      scrollTo: (options) => calls.push(options),
    })

    assert.equal(JSON.stringify(calls), '[{"top":0,"behavior":"smooth"}]')
  })

  it('renders an accessible visible button when scroll state is active', () => {
    const ScrollToTopButton = loadTsxModule(
      'src/features/scroll-to-top/ScrollToTopButton.tsx',
      {
        'react/jsx-runtime': require('react/jsx-runtime'),
        react: {
          useEffect: () => undefined,
          useState: () => [true, () => undefined],
        },
        './lib/scrollToTop': {
          scrollToPageTop: () => undefined,
          shouldShowScrollToTop: () => true,
        },
      },
    ).default

    const markup = renderToStaticMarkup(React.createElement(ScrollToTopButton))

    assert.match(markup, /\btype="button"/)
    assert.match(markup, /\baria-label="Scroll to top"/)
    assert.match(markup, /\bclass="button buttonVisible"/)
  })

  it('keeps the button hidden before the scroll threshold', () => {
    const ScrollToTopButton = loadTsxModule(
      'src/features/scroll-to-top/ScrollToTopButton.tsx',
      {
        'react/jsx-runtime': require('react/jsx-runtime'),
        react: {
          useEffect: () => undefined,
          useState: () => [false, () => undefined],
        },
        './lib/scrollToTop': {
          scrollToPageTop: () => undefined,
          shouldShowScrollToTop: () => false,
        },
      },
    ).default

    const markup = renderToStaticMarkup(React.createElement(ScrollToTopButton))

    assert.match(markup, /\bclass="button"/)
    assert.doesNotMatch(markup, /\bbuttonVisible\b/)
  })

  it('renders the scroll control from the masonry grid', () => {
    const GridMasonry = loadTsxModule('src/features/grid/GridMasonry.tsx', {
      'react/jsx-runtime': require('react/jsx-runtime'),
      '@/entities/image/model/type': {},
      '@/features/scroll-to-top': {
        __esModule: true,
        default: () =>
          React.createElement('button', {
            'aria-label': 'Scroll to top',
            type: 'button',
          }),
      },
      '@/shared/hooks/useInfiniteScroll': {
        useInfiniteScroll: () => ({
          lastElementRef: { current: null },
        }),
      },
      '@/shared/hooks/useResponsiveColumns': {
        useResponsiveColumns: () => 1,
      },
      './GridElement': {
        __esModule: true,
        default: ({ image }) =>
          React.createElement('img', {
            alt: image.description,
            src: image.urls.small,
          }),
      },
    }).default

    const markup = renderToStaticMarkup(
      React.createElement(GridMasonry, {
        items: [testImage],
        onLoadMore: async () => undefined,
        isLoading: false,
        hasMore: true,
      }),
    )

    assert.match(markup, /\baria-label="Scroll to top"/)
  })
})
