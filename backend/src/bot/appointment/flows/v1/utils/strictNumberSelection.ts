export default function strictNumberSelection(
  message: string,
  optionCount: number,
): number | undefined {
  const trimmed = message.trim();

  if (!/^\d+$/.test(trimmed)) return undefined;

  const asNumber = Number.parseInt(trimmed, 10);

  return asNumber >= 1 && asNumber <= optionCount ? asNumber - 1 : undefined;
}