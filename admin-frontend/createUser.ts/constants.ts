// =============================================================================
// Configuration — edit the constants below to match the user you want to create.
// =============================================================================

// --- User ---------------------------------------------------------------------
// Credentials the new user will use to log into the frontend (POST /auth/login):
// email + password. The password is sent in plaintext to POST /auth/signup,
// which hashes it on the backend side before storing it.
export const USER_FIRST_NAME = "user";
export const USER_LAST_NAME = "test";
export const USER_EMAIL = "user-test@barber-test.com";
export const USER_PASSWORD = "password123";

// --- Business -----------------------------------------------------------------
// The created user is linked to a business via its `businessId`. Either set
// BUSINESS_ID explicitly, or leave it empty and set BUSINESS_NAME — the script
// will then look up the id through GET /admin/business/all (by default matching
// the business created by setupBusiness/constants.ts).
export const BUSINESS_ID = "e8e99575-a897-46d3-b80c-1b62a8183603";
export const BUSINESS_NAME = "barber-test";