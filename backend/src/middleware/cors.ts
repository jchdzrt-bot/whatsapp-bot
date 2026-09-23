import type { NextFunction, Request, Response } from "express";

// Browser origins allowed to call the API directly during development
// (the Vite dev server). Tighten this list for production.
const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export default function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }

  // Allow the browser to store and send the auth cookies set by /auth/login
  // on cross-origin requests (frontend dev server → backend). Without this
  // header, the browser silently ignores Set-Cookie on CORS responses.
  res.set("Access-Control-Allow-Credentials", "true");

  res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key, Authorization",
  );
  res.set("Access-Control-Max-Age", "86400");

  // Answer CORS preflight queries before any auth/service middleware.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}