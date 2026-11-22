// Thin fetch wrapper for the PATCHY API. The JWT is kept in localStorage.
const BASE = (import.meta as any).env?.VITE_API_URL ?? "/api";
console.log("API BASE:", BASE);
const KEY = "patchy_token";

export const session = {
  get token() { return localStorage.getItem(KEY); },
  set(token: string) { localStorage.setItem(KEY, token); },
  clear() { localStorage.removeItem(KEY); },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T>(method: string, path: string, body?: unknown, form?: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (session.token) headers.Authorization = `Bearer ${session.token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Is the API running?");
  }
  if (res.status === 401 && session.token) {
    session.clear();
    window.dispatchEvent(new Event("patchy-unauthorized"));
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? data?.title ?? `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  get: <T = any>(p: string) => request<T>("GET", p),
  post: <T = any>(p: string, b?: unknown) => request<T>("POST", p, b ?? {}),
  put: <T = any>(p: string, b?: unknown) => request<T>("PUT", p, b ?? {}),
  del: <T = any>(p: string) => request<T>("DELETE", p),
  upload: <T = any>(p: string, f: FormData) => request<T>("POST", p, undefined, f),
};

export const qs = (o: Record<string, string | number | boolean | undefined | null>) => {
  const p = Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return p.length ? `?${p.join("&")}` : "";
};
