export default function buildConfirmNamePrompt(name: string): string {
  return [
    `Tu nombre es ${name}?`,
    "",
    "1. Si, es correcto",
    "2. No, quiero corregirlo",
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}