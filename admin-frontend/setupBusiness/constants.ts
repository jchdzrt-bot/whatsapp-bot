// =============================================================================
// Configuration — edit the constants below to match your backend / data.
// =============================================================================

// Base URL of the backend. In dev it listens on PORT=3001
// (see backend/.env.development → PORT=3001).
export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

// The /admin/* routes are protected by the `authenticatedService` middleware,
// which accepts the `x-api-key` header. Dev value: backend/.env.development
// → X_API_KEY='backend'.
export const X_API_KEY = process.env.X_API_KEY ?? "backend";

// --- Business -----------------------------------------------------------------
export const BUSINESS_NAME = "barber-test";
export const BUSINESS_PHONE = "5555555555";
export const BUSINESS_TYPE = "barber";
// `phoneNumberId` is a REQUIRED field of POST /admin/business (it's the Meta
// WhatsApp Business API phone number id). Replace this placeholder with the
// real one, otherwise the API rejects the request.
export const BUSINESS_PHONE_NUMBER_ID = "REPLACE_WITH_WHATSAPP_PHONE_NUMBER_ID";

// --- Location -----------------------------------------------------------------
export const LOCATION_NAME = "location-1";
// `address` is a REQUIRED field of POST /admin/location. Replace as needed.
export const LOCATION_ADDRESS = "Calle Falsa 123, Ciudad";

// --- Workers ------------------------------------------------------------------
// The backend requires `lastName` and `workingHours` for every worker, so the
// workers defined here only set `firstName`.
export const WORKERS = [
  { firstName: "Juan", lastName: "Perez" },
  { firstName: "Pedro", lastName: "Gomez" },
];

// --- Schedule -----------------------------------------------------------------
// `openHours` (location) and `workingHours` (worker) use the WeeklyHours shape:
//   { <weekday>: [{ start: "HH:mm", end: "HH:mm" }] }
export const BUSINESS_HOURS = {
  monday: [{ start: "09:00", end: "18:00" }],
  tuesday: [{ start: "09:00", end: "18:00" }],
  wednesday: [{ start: "09:00", end: "18:00" }],
  thursday: [{ start: "09:00", end: "18:00" }],
  friday: [{ start: "09:00", end: "18:00" }],
  saturday: [{ start: "09:00", end: "18:00" }],
  sunday: [],
};