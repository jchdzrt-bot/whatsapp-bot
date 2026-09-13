import { type ServiceOption } from "../utils/serviceOptionsOf";

export default function buildServicesPrompt(
  services: ServiceOption[],
): string {
  const options = services
    .map(
      (service, index) =>
        `${index + 1}. ${service.name} (${service.duration})`,
    )
    .join("\n");

  return [
    "Que servicio deseas?",
    "",
    options,
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}