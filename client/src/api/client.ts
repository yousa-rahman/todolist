// Defaults to a relative path so production builds work unmodified behind a
// same-origin rewrite (e.g. Vercel routing /api/* to the server service).
// Local dev overrides this via client/.env (VITE_API_URL=http://localhost:4000/api),
// since the client and server run on different ports there.
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

interface ApiErrorBody {
  error?: { message?: string };
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.error?.message) message = body.error.message;
    } catch {
      // response had no JSON body; fall back to the generic message
    }
    if (res.status === 401) {
      onUnauthorized?.();
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
