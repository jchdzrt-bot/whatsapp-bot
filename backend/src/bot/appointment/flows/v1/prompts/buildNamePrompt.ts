export default function buildNamePrompt(): string {
  return [
    "Para terminar, cual es tu nombre?",
    "",
    "Por ejemplo: Daniel Hernandez",
    "",
    "Solo envia tu numbre",
  ].join("\n");
}