import formatSpanishTime from "../utils/formSpanishTime";

export default function buildTimesPrompt(timeSlots: string[]): string {
  const options = timeSlots
    .map((slot, index) => `${index + 1}. ${formatSpanishTime(slot)}`)
    .join("\n");

  return [
    "Que hora te queda mejor?",
    "",
    options,
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}
