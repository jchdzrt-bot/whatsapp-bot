import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Worker, type WorkerMongoType } from "../../schemas/workerSchema";

export type CreateWorkerArgs = Omit<
  WorkerMongoType,
  "id" | "services" | "createdAt" | "updatedAt"
> & {
  services?: string[];
};

export default async function createWorker({
  locationId,
  firstName,
  lastName,
  services = [],
  workingHours,
}: CreateWorkerArgs): Promise<WorkerMongoType | undefined> {
  const newWorker = new Worker({
    locationId,
    firstName,
    lastName,
    services,
    workingHours,
  });

  try {
    await newWorker.save();
    console.log(`New worker created with first name: ${firstName}`);

    const { _id, __v, ...cleanWorker } = newWorker.toObject();

    return cleanWorker;
  } catch (error) {
    simpleErrorHandling("Error on adding a Worker:", error);
  }
}
