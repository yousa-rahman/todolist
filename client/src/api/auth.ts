import { apiRequest } from './client';
import type { AuthUser } from '../types/auth';

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export function register(username: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function login(username: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getMe(): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/auth/me');
}
