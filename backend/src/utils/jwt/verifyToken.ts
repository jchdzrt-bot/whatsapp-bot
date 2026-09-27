import jwt from "jsonwebtoken";
import { envs } from "../../index";
import {
  JWT_TOKEN_TYPE,
  type JwtPayload,
  type UserJwtPayload,
} from "./signToken";

export default function verifyAccessToken(
  token: string,
): UserJwtPayload | null {
  try {
    const payload = jwt.verify(token, envs.JWT_SECRET ?? "") as JwtPayload;

    if (payload.type !== JWT_TOKEN_TYPE.ACCESS) return null;

    const { type: _type, ...userPayload } = payload;

    return userPayload;
  } catch {
    return null;
  }
}