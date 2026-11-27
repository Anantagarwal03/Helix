import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './authContext';
import { apiRequest, clearCachedFilms, migrateLegacyFilms } from '../utils/libraryApi';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationWarning, setMigrationWarning] = useState('');
  const [preferences, setPreferences] = useState({ favoriteFilmIds: [], lastFilmId: '', spoilerLevel: 0 });
  const [preferencesLoadedForUserId, setPreferencesLoadedForUserId] = useState('');
  const preferencesLoaded = Boolean(user?.id && preferencesLoadedForUserId === user.id);
  const preferencesRef = useRef(preferences);
  const preferencesQueue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    apiRequest('/api/auth/session')
      .then(data => { if (active) setUser(data.user); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    apiRequest('/api/preferences')
      .then(data => { if (active) { preferencesRef.current = data.preferences; setPreferences(data.preferences); setPreferencesLoadedForUserId(user.id); } })
      .catch(() => { if (active) { const defaults = { favoriteFilmIds: [], lastFilmId: '', spoilerLevel: 0 }; preferencesRef.current = defaults; setPreferences(defaults); setPreferencesLoadedForUserId(user.id); } });
    return () => { active = false; };
  }, [user?.id]);

  const updatePreferences = useCallback(patch => {
    const previous = preferencesRef.current;
    const next = { ...previous, ...patch };
    preferencesRef.current = next;
    setPreferences(next);
    const operation = preferencesQueue.current.then(async () => {
      const data = await apiRequest('/api/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: next }),
      });
      if (preferencesRef.current === next) {
        preferencesRef.current = data.preferences;
        setPreferences(data.preferences);
      }
      return data.preferences;
    }).catch(error => {
      if (preferencesRef.current === next) {
        preferencesRef.current = previous;
        setPreferences(previous);
      }
      throw error;
    });
    preferencesQueue.current = operation.catch(() => {});
    return operation;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setMigrationWarning('');
    setUser(data.user);
    return data.user;
  }, []);

  const signUp = useCallback(async (email, password) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    try {
      await migrateLegacyFilms(data.user.id);
    } catch {
      setMigrationWarning('Your account was created, but saved maps from this browser could not be imported yet. They remain on this device; retry after checking the API connection.');
    }
    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      clearCachedFilms(user?.id);
      setMigrationWarning('');
      const defaults = { favoriteFilmIds: [], lastFilmId: '', spoilerLevel: 0 };
      preferencesRef.current = defaults;
      setPreferences(defaults);
      setPreferencesLoadedForUserId('');
      setUser(null);
    }
  }, [user?.id]);

  const value = useMemo(() => ({ user, loading, migrationWarning, signIn, signUp, signOut, preferences, preferencesLoaded, updatePreferences }), [user, loading, migrationWarning, signIn, signUp, signOut, preferences, preferencesLoaded, updatePreferences]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

