/* global process */
import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { validateFilm } from './library-validation.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const defaultDatabasePath = path.join(directory, 'data', 'helix.sqlite');
const defaultLegacyPath = process.env.HELIX_LEGACY_LIBRARY_PATH || path.join(directory, 'data', 'library.json');

export function createLibraryStore({ dbPath = process.env.HELIX_DB_PATH || defaultDatabasePath, legacyPath = defaultLegacyPath } = {}) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath, { timeout: 5000 });
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS films (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      film_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, film_id)
    ) STRICT, WITHOUT ROWID;
    CREATE TABLE IF NOT EXISTS legacy_films (
      film_id TEXT PRIMARY KEY,
      payload_json TEXT NOT NULL
    ) STRICT, WITHOUT ROWID;
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    ) STRICT, WITHOUT ROWID;
  `);

  const transaction = operation => {
    db.exec('BEGIN IMMEDIATE');
    try {
      const value = operation();
      db.exec('COMMIT');
      return value;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  };

  const migrationName = 'library-json-v1';
  const migrated = db.prepare('SELECT 1 FROM schema_migrations WHERE name = ?').get(migrationName);
  if (!migrated && fs.existsSync(legacyPath)) {
    let legacy;
    try {
      legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
    } catch (error) {
      db.close();
      throw new Error(`Could not read the old library file at ${legacyPath}: ${error.message}`, { cause: error });
    }
    if (!Array.isArray(legacy.films)) {
      db.close();
      throw new Error(`The old library file at ${legacyPath} has an invalid format.`);
    }
    transaction(() => {
      const insert = db.prepare('INSERT OR IGNORE INTO legacy_films (film_id, payload_json) VALUES (?, ?)');
      for (const film of legacy.films) {
        const validationError = validateFilm(film);
        if (!validationError) insert.run(film.id, JSON.stringify(film));
      }
      db.prepare('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)').run(migrationName, new Date().toISOString());
    });
  } else if (!migrated) {
    db.prepare('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)').run(migrationName, new Date().toISOString());
  }

  const store = {
    createUser({ id = randomUUID(), email, passwordHash, createdAt = new Date().toISOString() }) {
      return transaction(() => {
        db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)').run(id, email, passwordHash, createdAt);
        const pending = db.prepare('SELECT film_id, payload_json FROM legacy_films').all();
        const insertFilm = db.prepare('INSERT OR IGNORE INTO films (user_id, film_id, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
        for (const film of pending) insertFilm.run(id, film.film_id, film.payload_json, createdAt, createdAt);
        db.prepare('DELETE FROM legacy_films').run();
        return { id, email, createdAt };
      });
    },
    getUserByEmail(email) {
      return db.prepare('SELECT id, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = ?').get(email) || null;
    },
    getUserById(id) {
      return db.prepare('SELECT id, email, created_at AS createdAt FROM users WHERE id = ?').get(id) || null;
    },
    createSession({ tokenHash, userId, expiresAt, createdAt = new Date().toISOString() }) {
      db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(tokenHash, userId, expiresAt, createdAt);
    },
    getSession(tokenHash, now = Date.now()) {
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
      return db.prepare(`
        SELECT users.id, users.email, users.created_at AS createdAt, sessions.expires_at AS expiresAt
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > ?
      `).get(tokenHash, now) || null;
    },
    deleteSession(tokenHash) {
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    },
    listFilms(userId) {
      return db.prepare('SELECT payload_json FROM films WHERE user_id = ? ORDER BY created_at, film_id').all(userId)
        .map(row => JSON.parse(row.payload_json));
    },
    findFilm(userId, filmId) {
      const row = db.prepare('SELECT payload_json FROM films WHERE user_id = ? AND film_id = ?').get(userId, filmId);
      return row ? JSON.parse(row.payload_json) : null;
    },
    saveFilm(userId, film) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO films (user_id, film_id, payload_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, film_id) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at
      `).run(userId, film.id, JSON.stringify(film), now, now);
      return film;
    },
    importFilms(userId, incoming) {
      return transaction(() => {
        const insert = db.prepare('INSERT OR IGNORE INTO films (user_id, film_id, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)');
        const imported = [];
        const now = new Date().toISOString();
        for (const film of incoming) {
          const result = insert.run(userId, film.id, JSON.stringify(film), now, now);
          if (result.changes) imported.push(film);
        }
        return { films: imported, count: imported.length };
      });
    },
    removeFilm(userId, filmId) {
      return db.prepare('DELETE FROM films WHERE user_id = ? AND film_id = ?').run(userId, filmId).changes > 0;
    },
    close() {
      db.close();
    },
  };

  return store;
}
