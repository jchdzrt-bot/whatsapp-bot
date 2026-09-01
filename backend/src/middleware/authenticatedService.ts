import type { NextFunction, Request, Response } from "express";
import { envs } from "..";
import parseXApiKeyHeader from "./utils/parseXApiKeyHeader";

export default async function authenticatedService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { xApiKey } = parseXApiKeyHeader(req.headers);

  if (xApiKey === envs.X_API_KEY) {
    return next();
  }

  return res.status(401).json({ message: "Service not Authenticated" });
}
