import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Worker, type WorkerMongoType } from "../../schemas/workerSchema";

export default async function getWorkersByLocationId(
  locationId: string,
): Promise<WorkerMongoType[] | undefined> {
  try {
    const workers = await Worker.find({ locationId }).select("-_id -__v");
    return workers;
  } catch (error) {
    simpleErrorHandling(
      `Error getting workers for locationId: ${locationId}`,
      error,
    );
  }
}