import axios from "axios";
import { resolve } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { api } from "../api.js";
import type { Business, User } from "../types.js";
import {
  BUSINESS_ID,
  BUSINESS_NAME,
  USER_EMAIL,
  USER_FIRST_NAME,
  USER_LAST_NAME,
  USER_PASSWORD,
} from "./constants.js";

// Resolves the business the user will be linked to. Prefers an explicit
// BUSINESS_ID, otherwise it looks the id up by name via GET /admin/business/all.
async function resolveBusinessId(): Promise<string> {
  if (BUSINESS_ID) return BUSINESS_ID;

  const { data: businesses } = await api.get<Business[]>("/admin/business/all");
  const business = businesses.find((candidate) => candidate.name === BUSINESS_NAME);

  if (!business) {
    throw new Error(
      `No business found with name "${BUSINESS_NAME}". ` +
        "Run `npm start` (setupBusiness) first, or set BUSINESS_ID in createUser.ts/constants.ts.",
    );
  }

  return business.id;
}

// Creates a user that can log into the frontend, linked to the configured
// business, using the public backend route:
//   POST /auth/signup → user (businessId, email, password, firstName, lastName)
// The route verifies the business exists, hashes the password, and stores the
// user with that businessId, so the user belongs to the business on every
// request the frontend makes afterwards.
export default async function createUser(): Promise<User> {
  const businessId = await resolveBusinessId();

  const { data: user } = await api.post<User>("/auth/signup", {
    businessId,
    email: USER_EMAIL,
    password: USER_PASSWORD,
    firstName: USER_FIRST_NAME,
    lastName: USER_LAST_NAME,
  });

  console.log(`✅ User created:     ${user.email} (${user.id})`);
  console.log(`   Linked business:  ${user.businessId}`);
  console.log(`   Frontend login:   ${USER_EMAIL} / ${USER_PASSWORD}`);

  return user;
}

// Runs when this file is executed directly (`npm run create-user`); the guard
// keeps it inert when the function is imported by `../index.ts`.
const isMainModule =
  argv.length > 1 && resolve(argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  createUser().catch((error: unknown) => {
    console.error("\n❌ User creation failed:");

    if (axios.isAxiosError(error)) {
      const { method, url } = error.config ?? {};
      console.error(
        `   ${method?.toUpperCase()} ${url} → HTTP ${error.response?.status ?? "n/a"}`,
      );
      console.error(`   Response: ${JSON.stringify(error.response?.data)}`);
    } else {
      console.error(error);
    }

    process.exit(1);
  });
}
