/**
 * Date helpers for the appointment dashboard. The calendar is computed from
 * the real current date instead of any hardcoded sample dates.
 */

/** Local "YYYY-MM-DD" for a date (matches the appointment `date` field). */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Monday → Sunday for the week that contains `anchor`. */
export function weekDates(anchor: Date): Date[] {
  const day = anchor.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;

/** Short Spanish weekday label for a date, e.g. "Mié". */
export function dayLabel(date: Date): string {
  return DAY_LABELS[date.getDay()];
}

/** Spanish month name, e.g. "septiembre". */
function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", { month: "long" }).format(date);
}

/** Week range label, e.g. "8 - 14 de septiembre". */
export function formatWeekRangeLabel(week: Date[]): string {
  const first = week[0];
  const last = week[6];

  if (
    first.getMonth() === last.getMonth() &&
    first.getFullYear() === last.getFullYear()
  ) {
    return `${first.getDate()} - ${last.getDate()} de ${monthLabel(first)}`;
  }

  return `${first.getDate()} de ${monthLabel(first)} - ${last.getDate()} de ${monthLabel(last)}`;
}

/** HH:MM (24h) for a date, used when formatting appointment/message times. */
export function formatClockTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
