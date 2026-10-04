import { apiCall } from "./apiCall";
import type {
  Appointment,
  CreateAppointmentPayload,
} from "./types";

export async function getAppointments(
  locationId: string,
): Promise<Appointment[]> {
  // The backend returns the raw array (empty when there is no data), but never
  // trust the wire shape: a malformed response must not crash consumers that
  // call `.filter` / `.map` / `.length` on the result.
  const data = await apiCall<Appointment[]>({
    method: "GET",
    url: `/appointment/location/${locationId}`,
  });
  return Array.isArray(data) ? data : [];
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  return apiCall<Appointment>({
    method: "POST",
    url: "/appointment",
    data: payload,
  });
}

/**
 * Cancels an appointment in the backend. The PATCH endpoint
 * (backend/src/routes/mongo/user/appointment.ts) persists the status change
 * and returns the updated document under `{ appointment }`.
 */
export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  const data = await apiCall<{ appointment: Appointment }>({
    method: "PATCH",
    url: `/appointment/${appointmentId}`,
    data: { status: "cancelled", lastModifiedBy: "manual" },
  });

  if (!data || typeof data !== "object" || !data.appointment) {
    throw new Error("Unexpected cancel appointment payload from the API");
  }

  return data.appointment;
}
