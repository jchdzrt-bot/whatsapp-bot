import axios, { type AxiosRequestConfig } from "axios";

// Exposed from frontend/.env via vite.config.ts `envPrefix: ["VITE_", "BACKEND_"]`.
const BACKEND_URL = import.meta.env.BACKEND_URL ?? "http://localhost:3001";

// REST response envelope used by the backend session endpoints
// (backend/src/routes/auth/session.ts): `{ data: <payload> }`.
export type DataRestResponse<T> = {
  data: T;
};

// Shared API client. `withCredentials` lets the browser store the access/refresh
// httpOnly cookies set by /auth/login and send them back on every request
// (dev: 5173 → 3001).
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Unwrap axios' response so `await apiCall<T>(...)` resolves with the raw JSON
// body. The `data` envelope (when the endpoint uses one) is preserved for the
// caller to destructure against DataRestResponse<T>.
apiClient.interceptors.response.use((response) => response.data);

// Tags every subsequent request with a default header (e.g. x-tenant-id and
// x-location-id derived from the session's user-information).
export function setHeader(name: string, value: string) {
  apiClient.defaults.headers.common[name] = value;
}

export async function apiCall<T>(config: AxiosRequestConfig): Promise<T> {
  return apiClient.request(config) as Promise<T>;
}