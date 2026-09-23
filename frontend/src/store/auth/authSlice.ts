import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// The access/refresh tokens live in httpOnly cookies set by the backend
// (/auth/login) and are sent back automatically by the browser — they are
// never stored or read from client-side JS. This slice only tracks the
// signed-in user, persisted to localStorage so a reload can restore the
// session.
export const AUTH_SESSION_STORAGE_KEY = "whatsappBot.authSession";

// Mirrors the `user` object returned by the backend login response
// (backend/src/db/methods/user/loginUser.ts) — minus passwordHash.
export type AuthUser = {
  id: string;
  businessId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthState = {
  user: AuthUser | null;
};

export function isAuthenticated(state: { auth: AuthState }): boolean {
  return state.auth.user !== null;
}

function loadStoredSession(): AuthState {
  const rawSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!rawSession) return { user: null };

  try {
    const parsed = JSON.parse(rawSession);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.user === "object" &&
      parsed.user !== null
    ) {
      return parsed as AuthState;
    }
  } catch {
    // Corrupt/unreadable session — start logged out.
  }

  return { user: null };
}

function persistSession(session: AuthState) {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadStoredSession(),
  reducers: {
    authLoggedIn(state, action: PayloadAction<AuthSession>) {
      state.user = action.payload.user;
      persistSession({ ...state });
    },
    authLoggedOut(state) {
      state.user = null;
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    },
  },
});

export const { authLoggedIn, authLoggedOut } = authSlice.actions;

export default authSlice.reducer;