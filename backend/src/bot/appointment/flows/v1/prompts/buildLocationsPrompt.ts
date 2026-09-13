import { type LocationMongoType } from "../../../../../db/schemas/locationSchema";

export default function buildLocationsPrompt(
  locations: LocationMongoType[],
): string {
  const options = locations
    .map((location, index) => `${index + 1}. ${location.name}`)
    .join("\n");

  return [
    "En que locacion quieres la cita:",
    "",
    options,
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}
