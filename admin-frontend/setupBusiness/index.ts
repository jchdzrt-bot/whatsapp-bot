import { api } from "../api.js";
import {
  BUSINESS_HOURS,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_NUMBER_ID,
  BUSINESS_SERVICES,
  BUSINESS_TYPE,
  LOCATION_ADDRESS,
  LOCATION_NAME,
  WORKERS,
} from "./constants.js";
import type { Business, Location, Worker } from "../types.js";

// Creates the business and its single location, then adds every configured
// worker, using the backend /admin routes:
//   POST /admin/business    → business
//   POST /admin/location    → location (linked to the business)
//   POST /admin/worker      → each worker (linked to the location)
export default async function setupBusiness() {
  // 1. Create the business.
  const { data: business } = await api.post<Business>("/admin/business", {
    name: BUSINESS_NAME,
    type: BUSINESS_TYPE,
    phoneNumberId: BUSINESS_PHONE_NUMBER_ID,
    businessPhone: BUSINESS_PHONE,
    service: BUSINESS_SERVICES,
  });
  console.log(`✅ Business created:  ${business.name} (${business.id})`);

  // 2. Create the single location and link it to the business.
  const { data: locationResult } = await api.post<{
    location: Location;
    business: Business;
  }>("/admin/location", {
    businessId: business.id,
    name: LOCATION_NAME,
    address: LOCATION_ADDRESS,
    openHours: BUSINESS_HOURS,
  });
  const location = locationResult.location;
  console.log(`✅ Location created:  ${location.name} (${location.id})`);

  // 3. Create the workers and link them to the location.
  for (const workerInput of WORKERS) {
    const { data: workerResult } = await api.post<{
      worker: Worker;
      location: Location;
    }>("/admin/worker", {
      locationId: location.id,
      firstName: workerInput.firstName,
      lastName: workerInput.lastName,
      workingHours: BUSINESS_HOURS,
    });

    const worker = workerResult.worker;
    console.log(
      `✅ Worker created:   ${worker.firstName} ${worker.lastName} (${worker.id})`,
    );
  }

  console.log("\n🎉 Setup complete:");
  console.log(`   Business: ${business.name} → ${business.id}`);
  console.log(`   Location: ${location.name}   → ${location.id}`);
  console.log(
    `   Workers:  ${WORKERS.map((w) => `${w.firstName} ${w.lastName}`).join(", ")}`,
  );
}