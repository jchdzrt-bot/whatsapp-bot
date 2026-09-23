import jwt from "jsonwebtoken";
import { envs } from "../../index";
import { type USER_ROLE } from "../../db/schemas/userSchema";

export enum JWT_TOKEN_TYPE {
  ACCESS = "access",
  REFRESH = "refresh",
}

export type JwtPayload = {
  // Discriminator so an access token can never be used where a refresh
  // token is expected (and vice versa) regardless of expiry.
  type: JWT_TOKEN_TYPE;
  id: string;
  businessId: string;
  role: USER_ROLE;
};

export type UserJwtPayload = Omit<JwtPayload, "type">;

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 15; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Signs a JWT (HS256 by default) with the JWT_SECRET env var.
// Expiry is in seconds: jsonwebtoken only accepts a duration string like
// "7d" or a number; the number form is used so callers stay type-safe.
function signToken(payload: JwtPayload, expiresInSeconds: number): string {
  return jwt.sign(payload, envs.JWT_SECRET ?? "", {
    expiresIn: expiresInSeconds,
  });
}

// Short-lived token the client sends on every API request.
export function signAccessToken(payload: UserJwtPayload): string {
  return signToken(
    { ...payload, type: JWT_TOKEN_TYPE.ACCESS },
    ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  );
}

// Long-lived token the client stores and later exchanges (e.g. at a
// /auth/refresh endpoint) for a new access token.
export function signRefreshToken(payload: UserJwtPayload): string {
  return signToken(
    { ...payload, type: JWT_TOKEN_TYPE.REFRESH },
    REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  );
}