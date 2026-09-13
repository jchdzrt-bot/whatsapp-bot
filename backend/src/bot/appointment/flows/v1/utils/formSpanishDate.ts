import { MONTHS_ES, WEEKDAYS_ES } from "../constants";

export default function formatSpanishDate(date: Date): string {
  const weekday = WEEKDAYS_ES[date.getDay()] ?? "";
  const month = MONTHS_ES[date.getMonth()] ?? "";
  return `${weekday} ${date.getDate()} de ${month}`;
}