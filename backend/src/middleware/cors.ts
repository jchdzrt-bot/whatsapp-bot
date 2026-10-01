import type { NextFunction, Request, Response } from "express";

// Browser origins allowed to call the API directly. The Vite dev-server
// origins stay enabled for local development; production origins are appended
// from the ALLOWED_CORS_ORIGINS env var (comma-separated, e.g. the Render
// frontend URL). See backend/.env.production.example and render.yaml.
const DEV_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Normalize a browser Origin so minor formatting differences (trailing slash,
// whitespace, casing) can't silently break the CORS allow-list. Browsers send
// e.g. "https://frontend.onrender.com" (no trailing slash, lowercase host).
function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "").toLowerCase();
}

// Read at request time (not module-load time) so the value is always the
// process's current env; Render still needs a redeploy/restart after a change.
export default function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (origin && isOriginAllowed(origin)) {
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
    "Content-Type, x-api-key, Authorization, x-tenant-id, x-location-id",
  );
  res.set("Access-Control-Max-Age", "86400");

  // Answer CORS preflight queries before any auth/service middleware.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}

function isOriginAllowed(origin: string): boolean {
  const configured: string[] = (process.env.ALLOWED_CORS_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const allowed = new Set(
    [...DEV_ALLOWED_ORIGINS, ...configured].map(normalizeOrigin),
  );

  return allowed.has(normalizeOrigin(origin));
}