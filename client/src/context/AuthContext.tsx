import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { registerUnauthorizedHandler, setAuthToken } from '../api/client';
import type { AuthUser } from '../types/auth';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: AuthUser | null;
  status: Status;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_STORAGE_KEY = 'todo-app:token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const queryClient = useQueryClient();

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
    setStatus('unauthenticated');
    queryClient.clear();
  }

  function applySession(token: string, sessionUser: AuthUser) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);
    setUser(sessionUser);
    setStatus('authenticated');
  }

  useEffect(() => {
    registerUnauthorizedHandler(logout);

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    setAuthToken(token);
    authApi
      .getMe()
      .then(({ user: me }) => {
        setUser(me);
        setStatus('authenticated');
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setStatus('unauthenticated');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(username: string, password: string) {
    const { user: sessionUser, token } = await authApi.login(username, password);
    applySession(token, sessionUser);
  }

  async function register(username: string, password: string) {
    const { user: sessionUser, token } = await authApi.register(username, password);
    applySession(token, sessionUser);
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook live together by design
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
