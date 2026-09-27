import type { NextFunction, Request, Response } from "express";
import type { UserMongoType } from "../db/schemas/userSchema";
import verifyAccessToken from "../utils/jwt/verifyToken";

// Authenticates requests coming from the frontend (browser) session. Unlike
// authenticatedService (which guards service-to-service calls via the
// x-api-key header), this middleware validates the httpOnly accessToken cookie
// that /auth/login plants on the browser. Once verified, the JWT user claims
// are attached to the request so downstream routes can trust them.
export type AuthenticatedUserRequest = Request & {
  user: Pick<UserMongoType, "id" | "businessId" | "role">;
};

export default function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  (req as AuthenticatedUserRequest).user = user;

  return next();
}