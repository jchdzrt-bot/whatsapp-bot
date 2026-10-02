// =============================================================================
// Configuration — edit the constants below to match the business and the
// service catalog you want to publish.
// =============================================================================

// The id of the business whose services will be updated. Set it to the
// business you want to target (e.g. the one printed by `npm run setup`, or the
// `businessId` shown in the user profile response of `/auth/session/profile`).
export const BUSINESS_ID = "e8e99575-a897-46d3-b80c-1b62a8183603";

// The full service catalog the business offers, as a name → duration map. This
// *replaces* the current `service` field of the business document, so keep the
// complete list here (add/remove services, adjust durations, then re-run).
export const BUSINESS_SERVICES: Record<string, string> = {
  "Corte de cabello": "30 min",
  Barba: "15 min",
  "Corte + Barba": "45 min",
};