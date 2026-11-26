/* global process */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'helix-api-'));
process.env.HELIX_DB_PATH = path.join(directory, 'helix.sqlite');
process.env.HELIX_LEGACY_LIBRARY_PATH = path.join(directory, 'legacy-missing.json');
process.env.NODE_ENV = 'test';
const { app, store } = await import('../index.js');
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(async () => {
  await new Promise(resolve => server.close(resolve));
  store.close();
  fs.rmSync(directory, { recursive: true, force: true });
});

const request = async (pathname, { method = 'GET', body, cookie } = {}) => {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = response.status === 204 ? null : await response.json();
  return { response, data, setCookie: response.headers.get('set-cookie') || '' };
};

test('authentication protects APIs and isolates saved films between accounts', async () => {
  const unauthenticated = await request('/api/library');
  assert.equal(unauthenticated.response.status, 401);

  const unsupportedEmail = await request('/api/auth/register', {
    method: 'POST',
    body: { email: 'owner@abc.com', password: 'correct horse battery staple' },
  });
  assert.equal(unsupportedEmail.response.status, 400);
  assert.match(unsupportedEmail.data.error, /Gmail, Yahoo, Outlook/);

  const malformedEmail = await request('/api/auth/register', {
    method: 'POST',
    body: { email: 'owner..name@gmail.com', password: 'correct horse battery staple' },
  });
  assert.equal(malformedEmail.response.status, 400);

  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: { email: 'Owner@Gmail.com', password: 'correct horse battery staple' },
  });
  assert.equal(registration.response.status, 201);
  assert.match(registration.setCookie, /HttpOnly/);
  assert.match(registration.setCookie, /SameSite=Strict/);
  const firstCookie = registration.setCookie.split(';')[0];
  assert.equal((await request('/api/auth/session', { cookie: firstCookie })).response.status, 200);

  const invalidPassword = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'owner@gmail.com', password: 'wrong password' },
  });
  assert.equal(invalidPassword.response.status, 401);

  const duplicateAccount = await request('/api/auth/register', {
    method: 'POST',
    body: { email: 'owner@gmail.com', password: 'correct horse battery staple' },
  });
  assert.equal(duplicateAccount.response.status, 409);

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'OWNER@gmail.com', password: 'correct horse battery staple' },
  });
  assert.equal(login.response.status, 200);
  const loginCookie = login.setCookie.split(';')[0];
  assert.equal((await request('/api/auth/session', { cookie: loginCookie })).data.user.email, 'owner@gmail.com');

  const film = {
    id: 'tmdb-607', graphId: 'tmdb-607', title: 'Private Film', year: '2025', director: 'Director', genre: ['Mystery'], twistTag: 'Reveal',
    storyGraph: {
      id: 'tmdb-607', title: 'Private Film', summary: 'A private map.', twistType: 'Reveal',
      nodes: [
        { id: 'tmdb-607', label: 'Private Film', type: 'film', spoilerLevel: 0 },
        { id: 'beat-1', label: 'A beat', type: 'event', spoilerLevel: 0, sources: [{ label: 'Source', url: 'https://example.com' }] },
      ],
      links: [{ source: 'tmdb-607', target: 'beat-1', relationship: 'introduces', explanation: 'The story begins.' }],
    },
  };
  const saved = await request(`/api/library/${film.id}`, { method: 'PUT', body: { film }, cookie: loginCookie });
  assert.equal(saved.response.status, 200);
  assert.equal((await request('/api/library', { cookie: loginCookie })).data.films.length, 1);

  const secondRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: { email: 'other@yahoo.com', password: 'another secure password' },
  });
  assert.equal(secondRegistration.response.status, 201);
  const secondCookie = secondRegistration.setCookie.split(';')[0];
  assert.deepEqual((await request('/api/library', { cookie: secondCookie })).data.films, []);
  assert.equal((await request(`/api/library/${film.id}`, { cookie: secondCookie })).response.status, 404);

  const logout = await request('/api/auth/logout', { method: 'POST', cookie: loginCookie });
  assert.equal(logout.response.status, 204);
  assert.equal((await request('/api/library', { cookie: loginCookie })).response.status, 401);
});
