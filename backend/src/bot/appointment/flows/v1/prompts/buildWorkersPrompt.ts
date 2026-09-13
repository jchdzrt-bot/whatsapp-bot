import { type WorkerMongoType } from "../../../../../db/schemas/workerSchema";

export default function buildWorkersPrompt(workers: WorkerMongoType[]): string {
  const options = workers
    .map(
      (worker, index) => `${index + 1}. ${worker.firstName} ${worker.lastName}`,
    )
    .join("\n");

  return [
    "Tienes un barbero que quieres que te atienda?",
    "",
    options,
    "",
    "Responde con el numero de tu eleccion.",
  ].join("\n");
}
