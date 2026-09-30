/**
 * UI types and copy for the appointment dashboard.
 *
 * All sample/mock content was removed — the dashboard is fed by the backend
 * (appointment/location/worker/business endpoints).
 */

export type AppointmentTint = "violet" | "aqua";

export interface AppointmentInfo {
  worker: string;
  service: string;
  tint: AppointmentTint;
}

/** Header for each weekday column of the weekly calendar. */
export interface DayHeader {
  label: string;
  date: number;
  isToday: boolean;
}

/** A row of the weekly calendar at a given time. */
export interface TimeSlot {
  /** Displayed hour, e.g. "9:00". */
  time: string;
  /**
   * One entry per weekday column (Lun → Dom).
   * `null` represents an empty slot.
   */
  cells: Array<AppointmentInfo | null>;
}

/** Static filter button label (worker filter is wired by the dashboard). */
export const workerFilterLabel = "Todos los trabajadores";

export const calendarHint =
  "Click en una cita para editarla · Click en un espacio vacío para agregar una nueva";
