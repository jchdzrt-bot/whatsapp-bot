import type { AuthUser } from "../store/auth/authSlice";
import { apiCall, type DataRestResponse } from "./apiCall";

export type UserInformation = {
  tenantId: string;
  locationIds: string[];
  roles: string[];
};

type SessionProfile = {
  user: AuthUser;
};

// Mirrors the sample's `/api/session/user-information` call. The backend uses
// the httpOnly accessToken cookie to identify the caller, so no token is ever
// sent from the frontend.
export async function getUserInformation(): Promise<UserInformation> {
  const { data } = (await apiCall({
    method: "GET",
    url: "/auth/session/user-information",
  })) satisfies DataRestResponse<UserInformation>;

  return data;
}

// Mirrors the sample's `/api/session/profile` call: fresh DB profile for the
// cookie-authenticated user (401 when the cookie is missing/expired/invalid).
export async function getUserProfile(): Promise<AuthUser> {
  const { data } = (await apiCall({
    method: "GET",
    url: "/auth/session/profile",
  })) satisfies DataRestResponse<SessionProfile>;

  return data.user;
}