const legacyKey = 'helix-added-films';
const userCacheKey = userId => `helix-added-films:${userId}`;

export function readLegacyFilms() {
  try {
    const value = JSON.parse(localStorage.getItem(legacyKey) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function readCachedFilms(userId) {
  if (!userId) return [];
  try {
    const value = JSON.parse(localStorage.getItem(userCacheKey(userId)) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function clearCachedFilms(userId) {
  if (userId) localStorage.removeItem(userCacheKey(userId));
}

export async function apiRequest(path, options) {
  const response = await fetch(path, options);
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Helix API request failed (${response.status}).`);
  return data;
}

export async function migrateLegacyFilms(userId) {
  const legacyFilms = readLegacyFilms();
  for (let offset = 0; offset < legacyFilms.length; offset += 25) {
    await apiRequest('/api/library/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ films: legacyFilms.slice(offset, offset + 25) }),
    });
  }
  const { films = [] } = await apiRequest('/api/library');
  localStorage.setItem(userCacheKey(userId), JSON.stringify(films));
  localStorage.removeItem(legacyKey);
  return films;
}

export async function loadSavedFilms(userId) {
  if (!userId) return [];
  const { films = [] } = await apiRequest('/api/library');
  localStorage.setItem(userCacheKey(userId), JSON.stringify(films));
  return films;
}

export async function saveFilm(film) {
  const result = await apiRequest(`/api/library/${encodeURIComponent(film.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ film }),
  });
  return result.film;
}
