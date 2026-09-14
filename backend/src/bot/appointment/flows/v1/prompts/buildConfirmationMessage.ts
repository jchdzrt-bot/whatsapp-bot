import { DEFAULT_DURATION_MINUTES, DEFAULT_SERVICE } from "../constants";

export default function buildConfirmationMessage(data: FlowData): string {
  const timeRange = data.timeEndLabel
    ? `${data.timeLabel ?? data.time ?? "N/A"} - ${data.timeEndLabel}`
    : `${data.timeLabel ?? data.time ?? "N/A"}`;

  return [
    "Cita confirmada ✅",
    "",
    `👤 Cliente: ${data.name ?? "N/A"}`,
    `📍 Sucursal: ${data.locationLabel ?? "N/A"}`,
    `💈 Barbero: ${data.workerLabel ?? "N/A"}`,
    `✂️ Servicio: ${data.service ?? DEFAULT_SERVICE}`,
    `⏱️ Duracion: ${data.durationMinutes ?? DEFAULT_DURATION_MINUTES} min`,
    `🗓 Fecha: ${data.dateLabel ?? data.date ?? "N/A"}`,
    `⏰ Hora: ${timeRange}`,
    "",
    "¡Te esperamos!",
  ].join("\n");
}