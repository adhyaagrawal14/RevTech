/**
 * Central HTTP client for the RevTech FastAPI backend.
 * Set VITE_API_BASE_URL in .env.local. Endpoint paths and payload schemas
 * must be added only after checking the backend Swagger docs.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) { super(message); this.name='ApiError'; this.status=status; this.details=details; }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!path.startsWith('/')) throw new Error('API path must start with /.');
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'detail' in payload ? String((payload as {detail:unknown}).detail) : `API request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }
  return payload as T;
}

export const apiConfig = { baseUrl: API_BASE_URL };
