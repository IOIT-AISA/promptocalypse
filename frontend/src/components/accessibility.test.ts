import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Issue #65: primary inputs need accessible names (WCAG 4.1.2).
// ponytail: source-level assertion, no DOM test runner installed — swap for a
// rendered-component test if jsdom/testing-library ever lands.
const chatTerminal = readFileSync(new URL('./ChatTerminal.tsx', import.meta.url), 'utf8')
const keyVault = readFileSync(new URL('./KeyVault.tsx', import.meta.url), 'utf8')

describe('aria-labels on primary inputs (issue #65)', () => {
  it('chat terminal textarea is labelled "Injection Prompt"', () => {
    assert.match(chatTerminal, /<textarea[^>]*aria-label="Injection Prompt"/)
  })

  it('key vault flag input is labelled "Secret Flag Key"', () => {
    assert.match(keyVault, /<input[^>]*aria-label="Secret Flag Key"/)
  })
})
