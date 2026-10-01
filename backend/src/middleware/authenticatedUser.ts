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
    console.log(
      `[auth] authenticatedUser: no accessToken cookie on ${req.method} ${req.path} (any cookies sent: ${Boolean(req.headers.cookie)})`,
    );
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = verifyAccessToken(token);

  if (!user) {
    console.log(
      `[auth] authenticatedUser: invalid or expired accessToken on ${req.method} ${req.path}`,
    );
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  (req as AuthenticatedUserRequest).user = user;

  return next();
}