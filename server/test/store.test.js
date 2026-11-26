import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createLibraryStore } from '../library-store.js';

const film = {
  id: 'tmdb-84', graphId: 'tmdb-84', title: 'Store Film', year: '2024', director: 'Director',
  genre: ['Drama'], twistTag: 'Reveal',
  storyGraph: {
    id: 'tmdb-84', title: 'Store Film', summary: 'A tested map.', twistType: 'Reveal',
    nodes: [
      { id: 'tmdb-84', label: 'Store Film', type: 'film', spoilerLevel: 0 },
      { id: 'beat-1', label: 'A story beat', type: 'event', spoilerLevel: 0, sources: [{ label: 'Source', url: 'https://example.com' }] },
    ],
    links: [{ source: 'tmdb-84', target: 'beat-1', relationship: 'introduces', explanation: 'It starts the story.' }],
  },
};

test('SQLite library persists records and scopes them to the owning account', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'helix-store-'));
  const dbPath = path.join(directory, 'helix.sqlite');
  let store = createLibraryStore({ dbPath, legacyPath: path.join(directory, 'missing.json') });
  t.after(() => { store.close(); fs.rmSync(directory, { recursive: true, force: true }); });
  store.createUser({ id: 'user-a', email: 'a@example.test', passwordHash: 'test-hash' });
  store.createUser({ id: 'user-b', email: 'b@example.test', passwordHash: 'test-hash' });
  store.saveFilm('user-a', film);
  assert.deepEqual(store.listFilms('user-a'), [film]);
  assert.deepEqual(store.listFilms('user-b'), []);
  store.close();

  store = createLibraryStore({ dbPath, legacyPath: path.join(directory, 'missing.json') });
  assert.equal(store.findFilm('user-a', film.id).title, film.title);
  assert.equal(store.findFilm('user-b', film.id), null);
  assert.equal(store.removeFilm('user-b', film.id), false);
  assert.equal(store.removeFilm('user-a', film.id), true);
  assert.deepEqual(store.listFilms('user-a'), []);
});

test('imports the previous JSON library into only the first account', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'helix-migrate-'));
  let store;
  t.after(() => { store?.close(); fs.rmSync(directory, { recursive: true, force: true }); });
  const dbPath = path.join(directory, 'helix.sqlite');
  const legacyPath = path.join(directory, 'library.json');
  fs.writeFileSync(legacyPath, JSON.stringify({ version: 1, films: [film] }));
  store = createLibraryStore({ dbPath, legacyPath });
  store.createUser({ id: 'first-user', email: 'first@example.test', passwordHash: 'test-hash' });
  store.createUser({ id: 'second-user', email: 'second@example.test', passwordHash: 'test-hash' });
  assert.equal(store.findFilm('first-user', film.id).title, film.title);
  assert.equal(store.findFilm('second-user', film.id), null);
});
