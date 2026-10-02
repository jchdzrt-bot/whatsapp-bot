import axios from "axios";
import { resolve } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { api } from "../api.js";
import type { Business } from "../types.js";
import { BUSINESS_ID, BUSINESS_SERVICES } from "./constants.js";

// Replaces the service catalog of an existing business via:
//   PATCH /admin/business/:businessId/service
// The backend validates every entry (non-empty name → non-empty duration),
// persists the map as `service` on the business document, and the frontend
// dashboard reads it back so the "Nueva cita" modal can list the services.
export default async function updateServices(): Promise<Business> {
  const { data: business } = await api.patch<Business>(
    `/admin/business/${BUSINESS_ID}/service`,
    { service: BUSINESS_SERVICES },
  );

  console.log(`✅ Services updated:  ${business.name} (${business.id})`);
  for (const [name, duration] of Object.entries(BUSINESS_SERVICES)) {
    console.log(`   • ${name} → ${duration}`);
  }

  return business;
}

// Runs when this file is executed directly (`npm run update-services`); the
// guard keeps it inert when the function is imported by another module.
const isMainModule =
  argv.length > 1 && resolve(argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  updateServices().catch((error: unknown) => {
    console.error("\n❌ Service update failed:");

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