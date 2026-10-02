import { apiCall } from "./apiCall";
import type { Business, Location, Worker } from "./types";

export async function getBusiness(businessId: string): Promise<Business> {
  const data = await apiCall<Business>({
    method: "GET",
    url: `/business/${businessId}`,
  });

  // Same "never trust the wire shape" guard as the list helpers above. Legacy
  // business documents created before the `service` map existed come back
  // without the field, so normalize it to an object before consumers call
  // Object.keys(...) on it.
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Unexpected business payload from the API");
  }

  return { ...data, service: data.service ?? {} };
}

export async function getLocations(
  businessId: string,
): Promise<Location[]> {
  const data = await apiCall<Location[]>({
    method: "GET",
    url: `/location/${businessId}`,
  });
  // The backend returns a raw array, but never trust the wire shape: a malformed
  // response must not crash consumers that call `.length` / `.map` / `.find`.
  return Array.isArray(data) ? data : [];
}

export async function getWorkers(locationId: string): Promise<Worker[]> {
  const data = await apiCall<Worker[]>({
    method: "GET",
    url: `/worker/${locationId}`,
  });
  return Array.isArray(data) ? data : [];
}
