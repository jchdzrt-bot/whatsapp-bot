import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";
import { Worker, WorkerMongoType } from "../../schemas/workerSchema";

type ModifyWorkerArgs = {
  locationId: string;
} & Loosen<{
  firstName?: string;
  lastName?: string;
  services?: string[];
  workingHours?: WeeklyHours;
}>;

export default async function modifyWorker({
  locationId,
  firstName,
  lastName,
  services,
  workingHours,
}: ModifyWorkerArgs): Promise<WorkerMongoType | NullOrUndefined> {
  const updateFields = filterOutUndefinedProperties({
    firstName,
    lastName,
    services,
    workingHours,
  });

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields provided to update");
  }

  try {
    const worker = await Worker.findOneAndUpdate(
      { id: locationId },
      { $set: updateFields },
      { new: true },
    );

    if (!worker) {
      console.error(`No worker found with id: ${locationId}`);
      return null;
    }

    return worker.toObject();
  } catch (error) {
    simpleErrorHandling("Error modifying worker:", error);
  }
}
