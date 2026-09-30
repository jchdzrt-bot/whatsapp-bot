import { apiCall } from "./apiCall";
import type { Business, Location, Worker } from "./types";

export async function getBusiness(businessId: string): Promise<Business> {
  return apiCall<Business>({
    method: "GET",
    url: `/business/${businessId}`,
  });
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
