import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { apiRequest, clearCachedFilms, migrateLegacyFilms } from '../utils/libraryApi';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationWarning, setMigrationWarning] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/api/auth/session')
      .then(data => { if (active) setUser(data.user); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
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
      setUser(null);
    }
  }, [user?.id]);

  const value = useMemo(() => ({ user, loading, migrationWarning, signIn, signUp, signOut }), [user, loading, migrationWarning, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

