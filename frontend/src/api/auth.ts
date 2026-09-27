import axios from "axios";
import { apiCall } from "./apiCall";
import type { AuthUser } from "../store/auth/authSlice";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export async function login({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> {
  const data = await apiCall<LoginResponse>({
    method: "POST",
    url: "/auth/login",
    data: { email, password },
  });

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