import axios from "axios";
import type { AuthUser } from "../store/auth/authSlice";

// Exposed from frontend/.env via vite.config.ts `envPrefix: ["VITE_", "BACKEND_"]`.
const BACKEND_URL = import.meta.env.BACKEND_URL ?? "http://localhost:3001";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  // The access/refresh tokens never reach the frontend: /auth/login sets
  // them as httpOnly cookies, and the browser sends them back automatically.
  // The response body only carries the signed-in user's profile.
  user: AuthUser;
};

export async function login({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> {
  // withCredentials lets the browser store the access/refresh cookies set by
  // the backend and attach them to cross-origin requests (dev: 5173 → 3001).
  const { data } = await axios.post<LoginResponse>(
    `${BACKEND_URL}/auth/login`,
    { email, password },
    { withCredentials: true },
  );

  return data;
}

// Maps any failure of the login call to a user-facing message (page is in
// Spanish). Undefined behavior on success — only call with a thrown error.
export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      return "Correo y contraseña son obligatorios";
    }
    if (error.response?.status === 401) {
      return "Correo o contraseña incorrectos";
    }
    if (error.response) {
      return `Error del servidor (${error.response.status}). Inténtalo de nuevo.`;
    }
    // No response received: backend down, bad URL, or CORS block.
    return "No se pudo conectar con el servidor. Inténtalo de nuevo.";
  }

  return "Error inesperado al iniciar sesión. Inténtalo de nuevo.";
}