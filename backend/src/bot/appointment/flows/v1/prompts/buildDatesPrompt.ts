export default function buildDatesPrompt(
  dateOptions: { label: string }[],
): string {
  const options = dateOptions
    .map((option, index) => `${index + 1}. ${option.label}`)
    .join("\n");

  return [
    "Que dia te gustaria agendar tu cita?",
    "",
    options,
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}
