import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Issue #57 — collapsible leaderboard drawer.
// ponytail: source-level assertions, no DOM test runner installed — swap for a
// rendered-component test if jsdom/testing-library ever lands.
const read = (file: string) => readFileSync(new URL(file, import.meta.url), 'utf8')
const drawer = read('./RightDrawer.tsx')
const drawerCss = read('./RightDrawer.css')
const sidePanel = read('./SidePanel.tsx')
const app = read('../App.tsx')

describe('collapsible leaderboard drawer (issue #57)', () => {
  it('tucks the leaderboard out of the main grid', () => {
    assert.doesNotMatch(sidePanel, /fetchLeaderboard|leaderboard/)
    assert.match(app, /<RightDrawer\s+open=\{leaderboardOpen\}/)
  })

  it('offers a floating 🏆 Leaderboard toggle', () => {
    assert.match(drawer, /🏆 Leaderboard/)
    assert.match(drawer, /aria-expanded=\{open\}/)
    assert.match(drawerCss, /\.leaderboard-toggle\s*\{[^}]*position: fixed/)
  })

  it('slides in and out with translateX', () => {
    assert.match(drawerCss, /transform: translateX\(100%\)/)
    assert.match(drawerCss, /\.right-drawer--open\s*\{[^}]*transform: translateX\(0\)/)
    assert.match(drawerCss, /transition: transform/)
  })

  it('pauses leaderboard polling while the drawer is closed', () => {
    assert.match(drawer, /if \(!open\) return/)
  })
})
