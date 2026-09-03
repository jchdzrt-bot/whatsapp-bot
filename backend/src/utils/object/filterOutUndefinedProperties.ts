export default function filterOutUndefinedProperties<T extends object>(
  obj: T,
): Partial<T> {
  const filteredProperties: Partial<T> = {};

  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (value !== undefined) filteredProperties[key] = value;
  }

  return filteredProperties;
}
