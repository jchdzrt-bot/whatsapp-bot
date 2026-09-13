export default function formatSpanishTime(time: string): string {
  const [hourPart, minutePart] = time.split(":");
  const hour = Number.parseInt(hourPart ?? "0", 10);
  const minutes = minutePart ?? "00";
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${String(hour12).padStart(2, "0")}:${minutes} ${period}`;
}
