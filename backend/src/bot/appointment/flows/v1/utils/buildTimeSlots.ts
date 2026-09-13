import { TIME_SLOT_END_HOUR, TIME_SLOT_LIMIT, TIME_SLOT_START_HOUR } from "../constants";

export default function buildTimeSlots(durationMinutes: number): string[] {
  const startMinutes = TIME_SLOT_START_HOUR * 60;
  const endMinutes = TIME_SLOT_END_HOUR * 60;
  const slots: string[] = [];

  for (
    let at = startMinutes;
    at + durationMinutes <= endMinutes && slots.length < TIME_SLOT_LIMIT;
    at += durationMinutes
  ) {
    const hours = Math.floor(at / 60);
    const minutes = at % 60;
    slots.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
  }

  return slots;
}