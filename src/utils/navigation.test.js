import test from 'node:test'
import assert from 'node:assert/strict'
import { isNavItemActive } from './navigation.js'

test('marks Library active for a film detail route', () => {
  assert.equal(isNavItemActive('/film/sixth-sense', { label: 'Library', path: '/library' }), true)
})

test('does not mark other sections active for a film detail route', () => {
  assert.equal(isNavItemActive('/film/sixth-sense', { label: 'Graph', path: '/graph' }), false)
})

test('marks a section active for its exact route', () => {
  assert.equal(isNavItemActive('/library', { label: 'Library', path: '/library' }), true)
})
