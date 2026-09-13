export default function addMinutesToTime(time: string, minutes: number): string {
  const [hourPart, minutePart] = time.split(":");
  const totalMinutes =
    Number.parseInt(hourPart ?? "0", 10) * 60 +
    Number.parseInt(minutePart ?? "0", 10) +
    minutes;

  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}