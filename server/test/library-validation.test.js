import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFilm } from '../library-validation.js';

const createFilm = () => ({
  id: 'tmdb-42',
  graphId: 'tmdb-42',
  title: 'Example Film',
  year: '2024',
  director: 'Example Director',
  genre: ['Mystery'],
  twistTag: 'Identity Reveal',
  storyGraph: {
    id: 'tmdb-42',
    title: 'Example Film',
    summary: 'A sourced story map.',
    twistType: 'Identity Reveal',
    nodes: [
      { id: 'tmdb-42', label: 'Example Film', type: 'film', spoilerLevel: 0 },
      { id: 'beat-1', label: 'Opening clue', type: 'event', spoilerLevel: 0, sources: [{ label: 'Official source', url: 'https://example.com/film' }] },
    ],
    links: [{ source: 'tmdb-42', target: 'beat-1', relationship: 'introduces', explanation: 'The film opens with a clue.' }],
  },
});

test('accepts a well-formed generated story map', () => {
  assert.equal(validateFilm(createFilm()), null);
});

test('rejects IDs that do not match the TMDB story map', () => {
  const film = createFilm();
  film.graphId = 'tmdb-43';
  assert.match(validateFilm(film), /ID must match/);
});

test('rejects duplicate node IDs', () => {
  const film = createFilm();
  film.storyGraph.nodes.push({ ...film.storyGraph.nodes[1] });
  assert.match(validateFilm(film), /duplicate node/);
});

test('rejects dangling and self-referencing connections', () => {
  const dangling = createFilm();
  dangling.storyGraph.links[0].target = 'missing-node';
  assert.match(validateFilm(dangling), /invalid connection/);

  const selfLink = createFilm();
  selfLink.storyGraph.links[0].target = selfLink.storyGraph.links[0].source;
  assert.match(validateFilm(selfLink), /invalid connection/);
});

test('rejects unsafe or malformed source URLs', () => {
  const film = createFilm();
  film.storyGraph.nodes[1].sources[0].url = 'javascript:alert(1)';
  assert.match(validateFilm(film), /invalid source URL/);
});

test('rejects invalid spoiler levels and malformed links without throwing', () => {
  const invalidSpoiler = createFilm();
  invalidSpoiler.storyGraph.nodes[1].spoilerLevel = 3;
  assert.match(validateFilm(invalidSpoiler), /spoiler level/);

  const malformedLink = createFilm();
  malformedLink.storyGraph.links[0] = null;
  assert.match(validateFilm(malformedLink), /invalid connection/);
});
