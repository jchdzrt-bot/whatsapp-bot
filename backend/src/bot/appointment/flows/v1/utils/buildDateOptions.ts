import formatSpanishDate from "./formSpanishDate";
import toISODateString from "./toISODateString";

export default function buildDateOptions(
  limit: number,
): { date: string; label: string }[] {
  const options: { date: string; label: string }[] = [];

  const start = new Date();
  start.setDate(start.getDate() + 1); // tomorrow

  for (let index = 0; index < limit; index++) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    options.push({ date: toISODateString(day), label: formatSpanishDate(day) });
  }

  return options;
}
