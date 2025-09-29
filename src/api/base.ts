import { getAuthHeaders } from '@/lib/auth';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
export const IS_MOCK = import.meta.env.VITE_MOCK === 'true';

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(input: string, init?: RequestInit) {
  const auth = getAuthHeaders();
  const mergedHeaders: HeadersInit = {
    ...auth,
    ...(init?.headers as any)
  };
  const res = await fetch(apiUrl(input), { ...init, headers: mergedHeaders });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(`API ${init?.method || 'GET'} ${input} failed: ${res.status} ${res.statusText}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
  }
  return res;
} 