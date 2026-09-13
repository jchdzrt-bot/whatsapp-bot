export default function pickedOptionFromMessage<T>(
  message: string,
  options: readonly T[],
  labelOf: (option: T) => string,
): T | undefined {
  const trimmed = message.trim();

  const asNumber = Number.parseInt(trimmed, 10);
  if (!Number.isNaN(asNumber)) {
    return options[asNumber - 1];
  }

  const normalizedMessage = trimmed.toLowerCase();
  return options.find(
    (option) => labelOf(option).toLowerCase() === normalizedMessage,
  );
}