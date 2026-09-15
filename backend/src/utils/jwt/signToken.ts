import jwt from "jsonwebtoken";
import { envs } from "../../index";
import { type USER_ROLE } from "../../db/schemas/userSchema";

export type JwtPayload = {
  id: string;
  businessId: string;
  role: USER_ROLE;
};

const TOKEN_EXPIRES_IN = "7d";

// Signs a JWT (HS256 by default) with the JWT_SECRET env var.
export default function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, envs.JWT_SECRET ?? "", {
    expiresIn: TOKEN_EXPIRES_IN,
  });
}