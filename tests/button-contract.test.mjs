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
const buttonPath = join(projectRoot, 'src/shared/ui/Button/Button.tsx')
const require = createRequire(import.meta.url)

function loadButton() {
  const source = readFileSync(buttonPath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2023,
    },
  }).outputText

  const module = { exports: {} }
  const sandbox = {
    exports: module.exports,
    module,
    require: (id) => {
      if (id === 'react/jsx-runtime') {
        return require('react/jsx-runtime')
      }

      if (id === './Button.module.scss') {
        return { button: 'button', icon: 'icon' }
      }

      return require(id)
    },
  }

  vm.runInNewContext(compiled, sandbox, { filename: buttonPath })

  return module.exports.default
}

describe('Button', () => {
  it('renders a link with href when href is passed without download', () => {
    const Button = loadButton()
    const markup = renderToStaticMarkup(
      React.createElement(Button, {
        href: 'https://example.com/photo',
        label: 'Open',
      }),
    )

    assert.match(markup, /^<a\b/)
    assert.match(markup, /href="https:\/\/example\.com\/photo"/)
  })

  it('renders a downloadable link when href and download are passed', () => {
    const Button = loadButton()
    const markup = renderToStaticMarkup(
      React.createElement(Button, {
        download: true,
        href: 'https://example.com/photo.jpg',
        label: 'Download',
      }),
    )

    assert.match(markup, /^<a\b/)
    assert.match(markup, /href="https:\/\/example\.com\/photo\.jpg"/)
    assert.match(markup, /\bdownload=""/)
  })
})
