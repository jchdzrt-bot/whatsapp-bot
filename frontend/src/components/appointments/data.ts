/**
 * Mock data for the appointment dashboard.
 *
 * This is intentionally static — no redux and no backend calls yet. It will be
 * replaced with real API/selector data once the store wiring exists.
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

export const shop = {
  initials: "BA",
  name: "Barbería Ana",
  branch: "Sucursal Centro",
} as const;

export const workerFilterLabel = "Todos los trabajadores";

export const stats = [
  { label: "Citas hoy", value: 7 },
  { label: "Esta semana", value: 34 },
  { label: "Por confirmar", value: 2 },
] as const;

export const weekRangeLabel = "8 - 14 de septiembre";

export const days: DayHeader[] = [
  { label: "Lun", date: 8, isToday: false },
  { label: "Mar", date: 9, isToday: false },
  { label: "Mié", date: 10, isToday: true },
  { label: "Jue", date: 11, isToday: false },
  { label: "Vie", date: 12, isToday: false },
  { label: "Sáb", date: 13, isToday: false },
  { label: "Dom", date: 14, isToday: false },
];

export const timeSlots: TimeSlot[] = [
  {
    time: "9:00",
    cells: [
      null,
      { worker: "Ana", service: "Corte", tint: "violet" },
      { worker: "Luis", service: "Barba", tint: "aqua" },
      null,
      { worker: "Ana", service: "Corte", tint: "violet" },
      null,
      null,
    ],
  },
  {
    time: "11:00",
    cells: [
      { worker: "Luis", service: "Corte", tint: "aqua" },
      null,
      null,
      { worker: "Ana", service: "Barba", tint: "violet" },
      null,
      null,
      null,
    ],
  },
  {
    time: "14:00",
    cells: [
      null,
      null,
      { worker: "Luis", service: "Corte", tint: "aqua" },
      null,
      null,
      null,
      null,
    ],
  },
];

export const calendarHint =
  "Click en una cita para editarla · Click en un espacio vacío para agregar una nueva";